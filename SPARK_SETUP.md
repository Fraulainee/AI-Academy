# Hosting on an NVIDIA DGX Spark

Step-by-step guide to running the AI Academy (React frontend + Express API, one Docker container) on a DGX Spark and making it reachable by students and faculty.

For the app itself (features, config variables, API), see [README.md](README.md). This file covers only the Spark.

---

## 0. Is the app ready for the Spark?

| Check | Status |
|---|---|
| CPU architecture | The Spark is **ARM64** (Grace CPU). `node:20-alpine` is a multi-arch image and every dependency is pure JavaScript (`bcryptjs`, not native `bcrypt`), so nothing needs compiling for ARM. |
| GPU | Not needed. The app is a small web server. |
| Resources | A few hundred MB of RAM and almost no CPU. |
| Backend tests | 5 of 5 pass (`npm test` in `backend/`). |
| **Docker build** | **Not yet tested.** The Dockerfile was never built (the README says so, and Docker was not usable where this guide was written). Your first `docker compose up --build` on the Spark is the real test. Section 4 tells you what to check. |
| Lesson content | `backend/content/` has `week-01.md` and `week-02.md` to `week-20.md` except `week-07.md` (Week 7 uses the lesson built into the app), plus an `instructor/` folder. Check the folder is on the Spark before you deploy (section 3). |
| Database | One JSON file (`db.json`). Fine for one Spark and a few hundred learners. See section 9 for limits and backups. |
| HTTPS | **Required** for real use. Login cookies are marked `Secure`, so over plain `http` people sign in but are sent back to the landing page. Section 6 covers this. |

**Verdict:** ready to try. Expect to fix small things on the first build, and do not put real student data on it until you have finished sections 4, 6 and 9.

---

## 1. Prerequisites

- A DGX Spark with DGX OS (Ubuntu-based) set up and on your network.
- An account on it with `sudo`.
- A way to reach it: a monitor and keyboard, SSH, or NVIDIA Sync.
- For internet access (not just LAN): a domain name you control, plus a free Cloudflare account (section 6, Option B).

Find the Spark's address from the Spark itself:

```bash
hostname            # e.g. spark-1a2b
hostname -I         # its LAN IP, e.g. 192.168.1.50
```

Then, from your laptop:

```bash
ssh <your-user>@spark-1a2b.local     # or the IP address
```

---

## 2. Prepare the Spark

### 2.1 Update the system

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Check Docker

DGX OS normally includes Docker and Docker Compose v2.

```bash
docker --version
docker compose version
docker run --rm hello-world
```

If `docker` says *permission denied*, add yourself to the docker group, then **log out and back in**:

```bash
sudo usermod -aG docker $USER
```

If Docker is missing, install it:

```bash
sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable --now docker
```

### 2.3 Check the architecture (optional sanity check)

```bash
uname -m            # expect: aarch64
```

---

## 3. Get the project onto the Spark

Choose one.

### Option 1: copy from your laptop (rsync)

Run this **on your laptop**, from the folder that contains `AI Academy/`:

```bash
rsync -av \
  --exclude node_modules --exclude frontend/node_modules --exclude backend/node_modules \
  --exclude frontend/dist --exclude backend/data --exclude .env \
  "AI Academy/" <your-user>@spark-1a2b.local:~/ai-academy/
```

The excludes keep out your laptop's `node_modules` (built for x86), your local `db.json` (test accounts) and any `.env`.

### Option 2: git

If the project is in a git repository, run `git clone <repo-url> ~/ai-academy` on the Spark.

### Check the lesson content

On the Spark:

```bash
ls ~/ai-academy/backend/content
```

You should see `week-01.md` (and any others) next to the `instructor/` folder. If not, copy them in from wherever they live. `instructor/` holds answer keys and prep notes. It is not served to students, but it is copied into the image, so do not put anything in it you would not want on the server.

---

## 4. Configure and build

Run everything below on the Spark, from the project folder:

```bash
cd ~/ai-academy
```

### 4.1 Create the `.env` file

Docker Compose reads a `.env` file placed **next to `docker-compose.yml`** (the project root, not `backend/`).

```bash
# a random secret, 96 hex characters. Keep it private; never commit it.
echo "JWT_SECRET=$(openssl rand -hex 48)" > .env

# anyone who signs up with this email becomes an educator (comma-separate several)
echo "EDUCATOR_EMAILS=you@school.edu" >> .env

chmod 600 .env
```

Set `COOKIE_SECURE=false` **only** for a plain-http LAN test (section 6, Option A). For real use, leave it unset (it then defaults to `true`).

> If `JWT_SECRET` changes later, every user is signed out. That is harmless but annoying, so do not regenerate it casually.

### 4.2 Build and start

```bash
docker compose up -d --build
```

The first build takes a few minutes (it installs dependencies and builds the React app). Then check that it is running:

```bash
docker compose ps                    # State should be "running" / "healthy"
docker compose logs -f academy       # Ctrl+C to stop following
curl -s http://localhost:4000/api/health
```

Expected log line: `AI Academy API listening on :4000 (production)`.

### 4.3 If the first build fails

Because this build has not been tested, here are the likely problems:

| Symptom | Likely cause and fix |
|---|---|
| `JWT_SECRET must be set` / compose says the variable is required | `.env` is missing, in the wrong folder, or empty. It must be next to `docker-compose.yml`. |
| `npm ci` fails: "package-lock.json out of sync" | Run `npm install` in `frontend/` and `backend/` on a machine with Node, commit or copy the updated lock files, and rebuild. |
| `exec format error` | An image for the wrong architecture. Make sure you built **on the Spark** and did not copy an x86 image. |
| Build is killed or hangs | Out of disk or memory. Check `df -h` and `free -h`. |
| Site loads but looks unstyled or blank | Check `docker compose logs academy`, and the browser console. See also the fonts note in section 10. |

Send me the error output and I can fix the Dockerfile.

### 4.4 Test it from another computer on the same network

Open `http://<spark-ip>:4000` in a browser on your laptop.

- If the landing page loads, the container is fine.
- You can **view** pages over plain http, but **sign-in will not stick** until you do either of these:
  - put HTTPS in front (section 6, Option B or C), or
  - for a quick test only, set `COOKIE_SECURE=false` in `.env`, then run `docker compose up -d`.

---

## 5. Create the first faculty account

Pick **one** of these. Do not use `create-user` while the server is running (see the warning).

### Method 1 (easiest): sign up through the website

You listed your email in `EDUCATOR_EMAILS` in step 4.1. Open the site, use **Sign up** with that email, and the account is created as an educator and opens the Faculty Console.

If you add an email to `.env` later, run `docker compose up -d` so the container picks it up.

### Method 2: command line (stop the server first)

> **Warning:** the server keeps all users in memory and rewrites `db.json` from memory on every save. If you run `create-user` while the server is running, the next save from the server **overwrites the new account and it disappears**. Stop the server first.

```bash
docker compose stop academy
docker compose run --rm academy node scripts/create-user.js \
  --email prof@school.edu --name "Dr. Jose" --password 'a-long-password' --role educator
docker compose start academy
```

Demo accounts (`maya@supervaise.io` and so on) are **never** created in production.

---

## 6. Make it reachable

By default the site is on `http://<spark-ip>:4000`, which only works for computers on the same network. Choose how others reach it.

| Option | Who can reach it | HTTPS | Best for |
|---|---|---|---|
| A. LAN only | People on the same Wi-Fi/LAN | No (test only) | Testing in the office |
| **B. Cloudflare Tunnel** | Anyone on the internet | Yes, automatic | **Recommended for real use** |
| C. Tailscale | Only people you invite | Yes | Small private pilot |
| D. Port-forward + nginx + certbot | Anyone on the internet | Yes | Only if you control the router and have a public IP |

### Option A: LAN only (testing)

1. Put `COOKIE_SECURE=false` in `.env`.
2. `docker compose up -d`
3. Open `http://<spark-ip>:4000`.

If another computer cannot connect and `ufw` is on:

```bash
sudo ufw allow from 192.168.1.0/24 to any port 4000 proto tcp   # adjust to your subnet
```

Do not use this for real accounts. Passwords would travel unencrypted.

### Option B: Cloudflare Tunnel (recommended)

The Spark makes an **outbound** connection to Cloudflare, so you open no router ports and it works behind home or campus networks. Cloudflare provides the HTTPS certificate.

Requirements: a domain added to your Cloudflare account (free plan is fine).

1. **Install `cloudflared` on the Spark (ARM64):**

   ```bash
   curl -L --output cloudflared.deb \
     https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
   sudo dpkg -i cloudflared.deb
   cloudflared --version
   ```

2. **Create the tunnel in the dashboard** (simplest):
   - Cloudflare dashboard → **Zero Trust** → **Networks** → **Tunnels** → **Create a tunnel** → *Cloudflared*.
   - Name it `ai-academy`. Cloudflare shows an install command containing a token. Run it on the Spark. It looks like:
     ```bash
     sudo cloudflared service install <TOKEN-FROM-DASHBOARD>
     ```
   - Under **Public hostname**, add: subdomain `academy`, your domain, service type **HTTP**, URL `localhost:4000`.

3. **Make sure `COOKIE_SECURE` is not `false`** in `.env`. Remove that line if you added it for testing, then run `docker compose up -d`. `TRUST_PROXY=1` is already set in the image.

4. Visit `https://academy.yourdomain.com`, sign up or log in, and confirm you stay signed in after a page refresh.

The tunnel service starts automatically on reboot. Check it with `sudo systemctl status cloudflared`.

Optional hardening: in Cloudflare Zero Trust, add an **Access** policy so only certain email domains can reach the site at all (useful while testing). Rate limits on the login endpoints already exist in the app.

### Option C: Tailscale (private or small pilot)

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

- **Private:** each user installs Tailscale and you invite them to your tailnet. They open `http://<spark-tailnet-name>:4000`. Keep `COOKIE_SECURE=false` here only if you use plain http, or use Tailscale HTTPS below.
- **HTTPS inside the tailnet:** `sudo tailscale serve --bg 4000`, and use the `https://<spark>.<tailnet>.ts.net` address it prints.
- **Public over the internet:** `sudo tailscale funnel --bg 4000` gives a public `https://...ts.net` address. Funnel must be enabled for your tailnet in the Tailscale admin console first.

### Option D: port-forward + nginx + certbot

Only if you have a public IP and control of the router or firewall, and your network does not use CGNAT.

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo cp ~/ai-academy/deploy/nginx.conf /etc/nginx/sites-available/academy
sudo nano /etc/nginx/sites-available/academy        # set server_name academy.yourdomain.com
sudo ln -s /etc/nginx/sites-available/academy /etc/nginx/sites-enabled/academy
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d academy.yourdomain.com
```

Also: point the DNS A record at your public IP, forward router ports 80 and 443 to the Spark, and allow them in `ufw` (`sudo ufw allow 'Nginx Full'`). The container still listens on 4000. With nginx in front, you can stop exposing 4000 publicly (see section 8).

---

## 7. Keep it running

The compose file has `restart: unless-stopped`, and Docker starts on boot, so the app comes back after a reboot. Confirm once:

```bash
sudo reboot
# after it comes back:
docker compose -f ~/ai-academy/docker-compose.yml ps
```

Useful commands (run from `~/ai-academy`):

```bash
docker compose ps                  # status
docker compose logs -f academy     # live logs
docker compose restart academy     # restart
docker compose down                # stop and remove the container (data volume stays)
```

**Never** run `docker compose down -v`. The `-v` deletes the data volume, which is every user and all progress.

---

## 8. Optional: stop exposing port 4000 to the network

If you use Cloudflare Tunnel or nginx on the same machine, nothing needs to reach port 4000 from outside. In `docker-compose.yml`, change the port mapping from `"4000:4000"` to `"127.0.0.1:4000:4000"`, then run `docker compose up -d`. The tunnel and nginx still reach it on localhost, but nobody on the LAN can bypass them. This edit is optional and not done yet.

---

## 9. Data, backups and limits

All users and progress live in one file, `db.json`, inside the Docker volume `ai-academy_academy-data` (the prefix is the project folder name; check with `docker volume ls`).

### Back up

```bash
mkdir -p ~/backups
docker run --rm -v ai-academy_academy-data:/data -v ~/backups:/backup alpine \
  cp /data/db.json /backup/db-$(date +%F-%H%M).json
```

Automate it daily with cron (`crontab -e`):

```
0 2 * * * docker run --rm -v ai-academy_academy-data:/data -v $HOME/backups:/backup alpine cp /data/db.json /backup/db-$(date +\%F).json
```

**Copy the backups off the Spark** (another computer or cloud storage). A backup on the same disk is lost if the disk fails. Test a restore at least once: stop the container, copy a backup over `/data/db.json`, start it, and check you can log in.

### Restore

```bash
docker compose stop academy
docker run --rm -v ai-academy_academy-data:/data -v ~/backups:/backup alpine \
  cp /backup/db-2026-10-27.json /data/db.json
docker compose start academy
```

### Limits

- One server instance only. Do not run two copies against the same file.
- Suits a few hundred learners. Beyond that, or for stronger durability and audit needs, move to Postgres or SQLite (replace `backend/src/db.js`).
- The file holds names, emails, **bcrypt-hashed** passwords, and progress. It is not encrypted at rest. Turn on full-disk encryption on the Spark if the device could be physically removed, and check your privacy obligations (for example the Philippine Data Privacy Act, GDPR or FERPA) before collecting real student data.

---

## 10. Updating the app and lessons

### Code changes

```bash
# on your laptop: sync changes (same rsync command as section 3), or git pull on the Spark
cd ~/ai-academy
docker compose up -d --build
```

Data is kept, because it is in the volume.

### Weekly lessons (`week-NN.md`)

Lessons are baked into the image, so adding a file means a rebuild:

1. Put `week-02.md` etc. into `~/ai-academy/backend/content/`.
2. `docker compose up -d --build`

To edit lessons **without rebuilding**, mount the folder. Create `docker-compose.override.yml` next to `docker-compose.yml` (Compose merges it automatically):

```yaml
services:
  academy:
    volumes:
      - ./backend/content:/app/backend/content:ro
```

Then run `docker compose up -d` once. After that, saving a `.md` file and refreshing the browser is enough.

### Fonts

The site loads its fonts from Google Fonts, so students' browsers need internet access. For an offline or restricted network, self-host the fonts as described in the README ("Notes on how the pages were built").

---

## 11. Troubleshooting

| Problem | What to check |
|---|---|
| `docker: permission denied` | `sudo usermod -aG docker $USER`, then log out and in. |
| Compose says `JWT_SECRET` is required | `.env` must be in `~/ai-academy/`, next to `docker-compose.yml`. |
| Login works but you land back on the landing page | You are on plain http with `Secure` cookies. Use HTTPS (section 6 B/C/D), or `COOKIE_SECURE=false` on a LAN test only. |
| Works on the LAN but not through the tunnel | Check the tunnel's public hostname points to `HTTP` `localhost:4000`, and `sudo systemctl status cloudflared`. |
| Page refresh on `/dashboard` gives 404 | You are going through something that is not the Node server, or a proxy without the SPA fallback. The app and nginx config include it. |
| A user created with `create-user` vanished | It was run while the server was running. Use section 5, Method 1 or the stop-first Method 2. |
| Progress gone after a rebuild | The data volume was removed (`down -v`), or `DATA_DIR` was changed. Restore from a backup. |
| "Week N lesson not published yet" | No `backend/content/week-NN.md` for that week (section 3, section 10). |
| Cannot reach from another computer on the LAN | `ufw` blocking port 4000, wrong IP, or the Spark is on a different VLAN or guest Wi-Fi. |
| Container restarts repeatedly | `docker compose logs academy`. Usually a config error such as a short `JWT_SECRET` (needs 32+ characters). |

---

## 12. Security checklist before real students use it

- [ ] HTTPS in front (Cloudflare Tunnel, Tailscale HTTPS, or nginx + certbot)
- [ ] `JWT_SECRET` is random, 32+ characters, only in `.env` (mode 600), not in git
- [ ] `COOKIE_SECURE` is not `false`
- [ ] `EDUCATOR_EMAILS` lists only people who should have the Faculty Console
- [ ] Daily backups, copied off the Spark, with one restore tested
- [ ] `ufw` enabled; only needed ports open (`sudo ufw enable`, `sudo ufw allow OpenSSH`)
- [ ] Port 4000 bound to localhost if you use a tunnel or nginx (section 8)
- [ ] SSH uses keys, password login disabled
- [ ] System and Docker image updates scheduled (monthly: `sudo apt upgrade`, then `docker compose up -d --build`)
- [ ] A privacy notice and a plan for deleting a learner's data on request
- [ ] The Spark is on a UPS, or you accept downtime during power cuts

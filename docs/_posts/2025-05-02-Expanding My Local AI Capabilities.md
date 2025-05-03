---
layout: post
title: Open Web UI to LiteLLM, Expanding My Local AI Capabilities
date: 2024-09-03
description: more to come
---

Ever feel like you're outgrowing your current AI setup? That's exactly where I found myself recently with my TrueNAS Scale instance. While Open Web UI was serving me well and Ollama was doing its thing, the limitations were becoming increasingly apparent. That's when I discovered LiteLLM - a proxy that could potentially open the door to a world of AI models. Here's my journey of setting it up and the hurdles I overcame along the way.

## The Starting Point

My home lab setup was fairly straightforward:
- Open Web UI running on TrueNAS Scale
- Ollama for local models
- A growing frustration with their limitations

When I learned about LiteLLM, a proxy service that could extend my Open Web UI to communicate with various commercial and open-source models, I knew it was time for an upgrade.

## Planning the Infrastructure

I could have simply run the LiteLLM proxy as a container on my NAS, but anyone who's dealt with ZFS docker volume datasets knows they can be a pain to manage. Instead, I opted for a cleaner approach: dedicated VMs on Proxmox.

The plan was simple:
1. One VM for the LiteLLM proxy server
2. Another VM dedicated to PostgreSQL (thinking ahead for future projects)

## Setting Up the Virtual Machines

### First Hurdle: QEMU Guest Agent

After creating my Ubuntu Server VM on Proxmox, I immediately hit my first snag. The QEMU guest agent wasn't enabled by default. This agent is crucial as it allows the host machine to reallocate memory dynamically when needed.

The fix was straightforward:
```bash
apt install qemu-guest-agent
systemctl start qemu-guest-agent
```

Just like that, we were back on track.

### The Database VM

Next came the PostgreSQL VM setup. While this was happening, I faced an unrelated issue on my development machine - Homebrew was stuck "pouring some El Capitan tar" despite running on Sonoma. A quick restart resolved that issue, allowing me to install DBeaver to manage my PostgreSQL database.

## PostgreSQL Configuration

With the VMs running, it was time to configure PostgreSQL. I created a database but quickly realized I'd forgotten a crucial step - allowing connections from my laptop's VLAN.

The fix required editing:
```
/etc/postgresql/*/main/postgresql.conf
```

After adding an entry for my VLAN and restarting PostgreSQL, I was able to connect from my development machine and create the database. Progress!

## LiteLLM Proxy Configuration

Turning my attention to the LiteLLM proxy VM, I needed to prepare the configuration:

1. Modified the environment file to connect to my PostgreSQL database
   - Pro tip: The example env file had spaces around the equals signs that needed to be removed
2. Generated proper salt and master keys for security
3. Ran `docker-compose up` to bring the service online

## Adding External AI Models

With the proxy running, it was time for the exciting part - adding external AI models. I started with Claude by Anthropic:

1. Visited the Anthropic console (https://console.anthropic.com/dashboard)
2. Generated an API token
3. Added it to my LiteLLM configuration

And just like that... success! My Open Web UI was now connected to Claude, OpenAI, and had the potential to connect to any LLM I could get a token for.

## The Result

What started as a modest setup with local models has now transformed into a flexible AI powerhouse. My Open Web UI can now seamlessly switch between:
- Local models via Ollama
- Claude models from Anthropic
- OpenAI's GPT models
- Potentially any other API-accessible LLM

## Lessons Learned

This project reinforced several important concepts:
1. Proper infrastructure planning saves headaches down the road
2. Separating services into different VMs provides cleaner management
3. Database connection issues are often related to network configuration
4. Always check for spaces in configuration files!

The beauty of this setup is its extensibility. As new models become available, I can simply add their API keys to LiteLLM and immediately access them through my familiar Open Web UI interface.

Have you set up a similar AI proxy in your environment? What models are you connecting to? Let me know in the comments!
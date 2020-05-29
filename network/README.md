
-- Production

```bash
$ sudo nginx -t  #Check nginx if is valid
$ systemctl status nginx
$ pm2 start ./network/ecosystem.config.js --env production
```

-- Development

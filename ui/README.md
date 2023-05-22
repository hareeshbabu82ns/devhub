### Build

$> yarn build

````

### Running Locally
* run TypeScript node
```sh
$> yarn start
````

## Build

### Docker Local

```sh
$> docker build . -t devhubjs
$> docker run -p 4000:4000 --name devhubjs devhubjs
$> docker exec -it devhubjs sh
```

### Making Progressing Web App

- [REF](https://www.creativebloq.com/how-to/build-a-progressive-web-app)
- Build base `HTML`

```html
<!--index.html-->
<body>
  <div id="root">
    <div id="container">
      <div class="inner-container">
        <div id="header">
          <img src="/assets/icon.png" alt="logo" />
          <h1>Chat</h1>
        </div>
        <div id="loading-container">
          <img src="/assets/icon.png" alt="logo" id="loader" />
        </div>
      </div>
    </div>
  </div>
</body>
// index.js ReactDOM.render(
<App />, document.getElementById('root') );
```

- register a service worker

```javascript
<!--index.html-->
<script>
  if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
  navigator.serviceWorker.register('service-worker.js').then(function(registration) {
  // Registration was successful
  console.log('Registered!');
  }, function(err) {
  // registration failed :(
  console.log('ServiceWorker registration failed: ', err);
  }).catch(function(err) {
  console.log(err);
  });
  });
  } else {
  console.log('service worker is not supported');
  }
</script>
```

```javascript
// service-worker.js
self.addEventListener("install", function () {
  console.log("Install!");
});
self.addEventListener("activate", (event) => {
  console.log("Activate!");
});
self.addEventListener("fetch", function (event) {
  console.log("Fetch!", event.request);
});
```

- add push notifications

```javascript
navigator.serviceWorker.ready.then(function (registration) {
  if (!registration.pushManager) {
    alert("No push notifications support.");
    return false;
  }
  //To subscribe `push notification` from push manager
  registration.pushManager
    .subscribe({
      userVisibleOnly: true, //Always show notification when received
    })
    .then(function (subscription) {
      console.log("Subscribed.");
    })
    .catch(function (error) {
      console.log("Subscription error: ", error);
    });
});
```

- add web app manifest `manifest.json`

```json
{
  "short_name": "Chat",
  "name": "Chat",
  "icons": [
    {
      "src": "/assets/icon.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "start_url": "/?utm_source=homescreen",
  "background_color": "#e05a47",
  "theme_color": "#e05a47",
  "display": "standalone"
}
```

- configure the install prompt

```javascript
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("beforeinstallprompt Event fired");
  e.preventDefault();
  // Stash the event so it can be triggered later.
  this.deferredPrompt = e;
  return false;
});
// When you want to trigger prompt:
this.deferredPrompt.prompt();
this.deferredPrompt.userChoice.then((choice) => {
  console.log(choice);
});
this.deferredPrompt = null;
```

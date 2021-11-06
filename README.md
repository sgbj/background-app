# Background App

Proof of concept background service running a web API that other web apps can use to interact with the user's device.

Sometimes enterprise web apps need to interact with the user's device (e.g., file system, printers, scanners, and other devices). But security restrictions in most browsers make this difficult to achieve with ordinary JS. However, if you install a background service on the user's machine that exposes a web API with this functionality, you can call it from the web application. This pattern can provide a seamless experience for your users, and it's in use by several credit card processors and commercial printing and scanning libraries.

This application only implements a simple file explorer API, but it can be expanded to do more.

![File explorer screenshot 1](https://user-images.githubusercontent.com/5178445/140623188-a994ca3d-62f2-44ff-96bc-ffe6e7229116.png)

![File explorer screenshot 2](https://user-images.githubusercontent.com/5178445/140623227-05da9615-fcb3-4da6-8aa1-501efabbd6bd.png)

## Features

* Demo file explorer API and web app
* Built-in update feature using GitHub releases

## Considerations

* Requests should be authorized with a third-party provider
* Use a proper installer rather than PowerShell
* Certificate management
* Cross-platform

Helper for raycasting from camera to mouse position and dispatching events to game objects if they are clicked.

1) Clone git as module to your angular project
2) Add `MouseRaycastModule` to your `GameModule` imports
3) Add `MouseRaycastService` to any constructor where you want to use it
4) Get Init method from `MouseRaycastService`
5) Add `MouseRaycastService` update method to your game loop
6) Add array of objects to `MouseRaycastService` you want to raycast
7) Add subscription on object click event


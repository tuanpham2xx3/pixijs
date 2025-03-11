import { Application, Assets, Sprite } from "pixi.js";
import { SceneManager } from "./scenes/SceneManager";
import { MenuScene } from "./scenes/MenuScene";

(async () => {
  // Create a new application
  const app = new Application();
  const sceneManager = new SceneManager(app);
  const menuScene = new MenuScene(sceneManager);
  // Khởi tạo ứng dụng
  await app.init({ 
    background: "#1099bb", 
    resizeTo: window,
    resolution: window.devicePixelRatio || 1
  });
  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);


  window.addEventListener('resize', () => {
      // xử lý thay đổi kích cỡ
  });
  // khởi động game loop
  app.ticker.add((time) => {
    sceneManager.update(time.deltaTime);
  });
  await sceneManager.gotoScene(menuScene);
})();

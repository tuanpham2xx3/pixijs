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
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
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

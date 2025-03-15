export class HandleControls {
  private app: any;
  private player: any;

  constructor(app: any, player:any) {
    this.app = app;
    this.player = player;
  }

  public setupControls() {
    // Các phím điều khiển
    const keys: { [key:string]: boolean } = {};
    
    window.addEventListener('keydown', (e) => {
      keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      keys[e.key] = false;
    });

    // Game loop xử lý điều khiển
    this.app.ticker.add(() => {
      if(!this.player) return;

      let isMoving = false;
      if (keys['ArrowUp'] || keys[' '] || keys['w'] || keys['W']) {
        this.player.jump();
      }
      if (keys['f'] || keys['F']) {
        this.player.attack();
      }
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        this.player.moveLeft();
        isMoving = true;
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        this.player.moveRight();
        isMoving = true;
      }
      if (!isMoving) {
        this.player.idle();
      }
    });
  }
}
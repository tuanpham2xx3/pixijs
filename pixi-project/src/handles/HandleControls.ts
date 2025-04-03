export class HandleControls {
  private app: any;
  private player: any;
  private keys: Set<string> = new Set();

  constructor(app: any, player: any) {
    this.app = app;
    this.player = player;
  }

  public setupControls() {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase());
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    // Game loop xử lý điều khiển
    this.app.ticker.add(() => {
      if (!this.player) return;

      const up = this.keys.has('arrowup') || this.keys.has('w');
      const down = this.keys.has('arrowdown') || this.keys.has('s');
      const left = this.keys.has('arrowleft') || this.keys.has('a');
      const right = this.keys.has('arrowright') || this.keys.has('d');

      if (up && right) {
        this.player.moveUpRight();
      } else if (up && left) {
        this.player.moveUpLeft();
      } else if (down && right) {
        this.player.moveDownRight();
      } else if (down && left) {
        this.player.moveDownLeft();
      } else if (up) {
        this.player.moveUp();
      } else if (down) {
        this.player.moveDown();
      } else if (right) {
        this.player.moveRight();
      } else if (left) {
        this.player.moveLeft();
      } else {
        this.player.idle();
      }
    });
  }
}
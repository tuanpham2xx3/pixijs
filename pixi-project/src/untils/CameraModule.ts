import { Application, Container, Renderer } from 'pixi.js';
import {Player} from '../entities/Player.ts';

export interface CameraBounds {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export interface CameraOptions {
    target?: Container;
    bounds?: CameraBounds;
    lerp?: number; // Hệ số mượt cho camera (0-1)
  }

export class Camera {
    public container: Container;
    private app: Application<Renderer<HTMLCanvasElement>>;
    private target: Container | null = null;
    private bounds: CameraBounds;
    private lerp: number = 0.1; // Giá trị mặc định cho camera mượt
    
    constructor(app: Application<Renderer<HTMLCanvasElement>>, options?: CameraOptions) {
      this.app = app;
      this.container = new Container();
      this.bounds = options?.bounds || {
        x: 0,
        y: 0,
        width: app.screen.width,
        height: app.screen.height
      };
      if(options?.target) {
        this.target = options.target;
    }
      if (options?.lerp !== undefined) {
        this.lerp = Math.max(0, Math.min(1, options.lerp));
    }
    }

    public setTarget(target: Container | null): void {
        this.target = target;
    }
      
    public setBounds(bounds: CameraBounds): void {
        this.bounds = bounds;
    }
    public update(): void {
        if (!this.target) return;
        
        // Tính toán vị trí đích cho camera
        const targetX = this.app.screen.width / 2 - this.target.position.x;
        const targetY = this.app.screen.height / 2 - this.target.position.y;
        
        // Áp dụng lerp để camera di chuyển mượt hơn
        if (this.lerp < 1) {
          this.container.position.x += (targetX - this.container.position.x) * this.lerp;
          this.container.position.y += (targetY - this.container.position.y) * this.lerp;
        } else {
          this.container.position.x = targetX;
          this.container.position.y = targetY;
        }
        
        // Giới hạn camera trong bounds
        this.clampToBounds();
    }
    private clampToBounds(): void {
        const leftLimit = this.app.screen.width - this.bounds.x;
        const rightLimit = -(this.bounds.width - this.app.screen.width - this.bounds.x);
        const topLimit = this.app.screen.height - this.bounds.y;
        const bottomLimit = -(this.bounds.height - this.app.screen.height - this.bounds.y);
        
        this.container.position.x = Math.max(rightLimit, Math.min(leftLimit, this.container.position.x));
        this.container.position.y = Math.max(bottomLimit, Math.min(topLimit, this.container.position.y));
    }
    public addChild(child: Container): Container {
        return this.container.addChild(child);
    }
      
    public removeChild<T extends Container>(child: T): T {
        return this.container.removeChild(child);
    }
    public focus(x: number, y: number, instant: boolean = false): void {
        const targetX = this.app.screen.width / 2 - x;
        const targetY = this.app.screen.height / 2 - y;
        
        if (instant) {
          this.container.position.x = targetX;
          this.container.position.y = targetY;
        } else {
          // Sử dụng lerp để di chuyển mượt đến vị trí mới
          this.container.position.x += (targetX - this.container.position.x) * this.lerp;
          this.container.position.y += (targetY - this.container.position.y) * this.lerp;
        }
        this.clampToBounds();
    }
}
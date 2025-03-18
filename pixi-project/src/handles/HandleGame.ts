import { Application, Assets, Sprite, Texture } from "pixi.js";
import { Player} from '../entities/Player';
import { HandleControls } from './HandleControls';
import * as PIXI from 'pixi.js';
import {Camera} from '../untils/CameraModule';

export class Game {
    private app: Application;
    private player?: Player;
    private controls!: HandleControls;
    private background?: Sprite;
    private camera?:Camera;
  
    constructor(app: Application) {
      console.log('Game constructor called');
      this.app = app ;
    }

    private async loadBackground() {
      try {
        // Tạo background tạm thời với màu đơn giản
        const tempBackground = new PIXI.Graphics();
        tempBackground.beginFill(0x1099bb);
        tempBackground.drawRect(0, 0, window.innerWidth, window.innerHeight);
        tempBackground.endFill();
        this.app.stage.addChild(tempBackground);

        // Load background image
        const backgroundTexture = await Assets.load('assets/background/background.png');
        
        // Tạo sprite từ texture
        this.background = new Sprite(backgroundTexture);
        this.background.width = window.innerWidth;
        this.background.height = window.innerHeight;
        
        // Thay thế background tạm thời bằng sprite mới
        this.app.stage.removeChild(tempBackground);
        this.app.stage.addChild(this.background);
        
        // Đặt background ở dưới cùng của stage
        this.background.zIndex = -1;
        
        return true;
      } catch (error) {
        console.error('Không thể load background:', error);
        return false;
      }
    }

    async init() {
      console.log('Game init started');
      
      try {
        console.log('Application initialized');
        // Load background
        await this.loadBackground();
        
        // Đăng ký tài nguyên player
        console.log('Registering player assets...');
        Assets.add([
            { alias: 'headAtlas', src: 'assets/player/head.json' },
            { alias: 'bodyAtlas', src: 'assets/player/body.json' },
            { alias: 'feetAtlas', src: 'assets/player/feet.json' }
        ]);
        
        // Load player assets
        console.log('Loading player assets...');
        const loadedAssets = await Assets.load(['headAtlas', 'bodyAtlas', 'feetAtlas']);
        console.log('Loaded assets:', {
            head: Assets.get('headAtlas'),
            body: Assets.get('bodyAtlas'),
            feet: Assets.get('feetAtlas')
        });

        // Tạo player với resources là Spritesheet
        this.player = new Player({
            x: this.app.screen.width / 2,
            y: this.app.screen.height / 2,
            scale: 1,
            resources: {
                head: Assets.get('headAtlas'), // Đảm bảo đây là Spritesheet
                body: Assets.get('bodyAtlas'),
                feet: Assets.get('feetAtlas')
            }
        });

        // Khởi tạo player - QUAN TRỌNG
        this.player.initialize();
        //CAMERA
        this.camera = new Camera(this.app, {
          target: this.player ,
          bounds: { x: -500, y: -500, width: 500, height: 500 },
          lerp: 0.1 // Camera di chuyển mượt
        });
        if (this.player.parent) {
          this.player.parent.removeChild(this.player);
        }
        this.camera.addChild(this.player);
        // Thêm CAMERACAMERA vào stage
        this.app.stage.addChild(this.camera.container);

          // Thêm game loop để cập nhật camera
        this.app.ticker.add(() => {
            if (this.camera) {
                this.camera.update();
            }
        });
      



        // Sau đó mới tạo controls với player
        this.controls = new HandleControls(this.app, this.player);
        this.controls.setupControls();
        console.log('Controls setup complete');

        // Xử lý resize window
        window.addEventListener('resize', () => {
          if (this.background) {
            this.background.width = window.innerWidth;
            this.background.height = window.innerHeight;
          }
        });

        console.log('Game initialization complete');
      } catch (error) {
        console.error('Lỗi khởi tạo game:', error);
        throw error; // Ném lỗi để GameplayScene có thể bắt được
      }
    }

    getStage() {
      return this.camera ? this.camera.container : this.app.stage;
    }
}
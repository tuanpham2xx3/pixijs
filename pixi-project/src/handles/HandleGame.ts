import { Application, Assets, Sprite, Texture } from "pixi.js";
import { Player} from '../entities/Player';
import { HandleControls } from './HandleControls';
import * as PIXI from 'pixi.js';

export class Game {
    private app: Application;
    private player?: Player;
    private controls!: HandleControls;
    private background?: Sprite;
  
    constructor() {
      console.log('Game constructor called');
      this.app = new Application();
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
        
        return true;
      } catch (error) {
        console.error('Không thể load background:', error);
        return false;
      }
    }

    async init() {
      console.log('Game init started');
      
      try {
        // Khởi tạo ứng dụng
        await this.app.init({
          width: window.innerWidth,
          height: window.innerHeight,
          resizeTo: window
        });
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

        // Thêm player vào stage
        this.app.stage.addChild(this.player);
        console.log('Player added to stage');

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
      return this.app.stage;
    }
}
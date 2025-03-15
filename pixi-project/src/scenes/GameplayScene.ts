import * as PIXI from 'pixi.js';
import {BaseScene} from './BaseScenes';
import { Game } from '../handles/HandleGame';

export class GameplayScene extends BaseScene {
    private game?: Game;
    private container?: PIXI.Container;

    async onStart(container: PIXI.Container): Promise<void> {
        this.container = container;
        console.log('Gameplay Scene đang tải.');
        // Tạo instance của Game
        this.game = new Game();
        
        // Khởi tạo game
        await this.game.init();
        
        // Thêm stage của game vào container của scene
        this.container.addChild(this.game.getStage());
        
        console.log('Gameplay Scene tải xong.');
    }

    onUpdate(deltaTime: number): void {
        // Game đã có ticker riêng nên không cần gọi update ở đây
    }

    async onFinish(): Promise<void> {
        // Dọn dẹp game
        if (this.game) {
            this.game = undefined;
        }
        
        console.log('Gameplay Scene kết thúc.');
    }
}


import * as PIXI from 'pixi.js';
import {BaseScene} from './BaseScenes';
import {GameplayScene} from './GameplayScene';

export class MenuScene extends BaseScene {
    async onStart(container: PIXI.Container): Promise<void> {
        console.log('Menu Scene started');
        // Lấy kích thước màn hình từ application
        const app = this.coordinator.getApp();
        const appWidth = app.screen.width;
        const appHeight = app.screen.height;
        const titleText = new PIXI.Text({
            text: 'Menu',
            style: {
                fontSize: 50 ,
                fill:0xffffff
            }
        });
        // Đặt điểm neo ở giữa text để căn giữa
        titleText.anchor.set(0.5);
        // Sử dụng kích thước màn hình từ app
        titleText.x = appWidth / 2;
        titleText.y = appHeight / 3;

        const startButton = new PIXI.Text({
            text: 'Start Game',
            style: {
                fontSize: 50 ,
                fill:0xffffff
            }
        });
        // Đặt điểm neo ở giữa text để căn giữa
        startButton.anchor.set(0.5);
        // Sử dụng kích thước màn hình từ app
        startButton.x = appWidth / 2;
        startButton.y = appHeight / 2;
        startButton.interactive = true;
        startButton.cursor = 'pointer';

        startButton.on('pointerup', () => {
            console.log('Start button clicked');
            this.coordinator.gotoScene(new GameplayScene(this.coordinator));
        });
        container.addChild(titleText);
        container.addChild(startButton);
        console.log('Menu Scene setup complete');
    }
    onUpdate(delta: number): void {
        // Không cần cập nhật gì cho menu
    }

    async onFinish(): Promise<void> {
        console.log('Menu Scene kết thúc.');
    }
}

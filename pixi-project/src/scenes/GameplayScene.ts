import * as PIXI from 'pixi.js';
import {BaseScene} from './BaseScenes';
import {MenuScene} from './MenuScene';

export class GameplayScene extends BaseScene {
    private sprite!: PIXI.Sprite; // Sử dụng toán tử ! để báo với TypeScript rằng thuộc tính sẽ được khởi tạo
    
    async onStart(container: PIXI.Container): Promise<void> {
        const backButton = new PIXI.Text({
            text: 'Back to Menu',
            style: {
                fontSize: 20,
                fill: 0xff0000
            }
        });
        backButton.x = 500;
        backButton.y = 500;
        backButton.eventMode = 'static';
        backButton.cursor = 'pointer';
        backButton.on('pointerup', () => {
            this.coordinator.gotoScene(new MenuScene(this.coordinator));
        });

        // Load asset with correct path format for Vite (leading slash)
        await PIXI.Assets.load('/assets/bunny.png');
        const sprite = PIXI.Sprite.from('/assets/bunny.png');
        sprite.anchor.set(0.5);
        sprite.x = 600;
        sprite.y = 600;

        container.addChild(backButton);
        container.addChild(sprite);

        this.sprite = sprite; // Lưu tham chiếu để cập nhật trong `onUpdate`
    }

    onUpdate(delta: number): void {
        this.sprite.rotation += delta * 0.01; // Xoay sprite mỗi frame
    }

    async onFinish(): Promise<void> {
        console.log('Gameplay Scene kết thúc.');
    }
}

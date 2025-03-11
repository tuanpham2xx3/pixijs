import * as PIXI from 'pixi.js';
import { SceneManager } from './SceneManager';

export class BaseScene {
    protected coordinator: SceneManager;

    constructor(coordinator: SceneManager) {
        this.coordinator = coordinator;
    }

    // Phương thức khởi tạo scene (phải được triển khai bởi lớp con)
    async onStart(container: PIXI.Container): Promise<void> {}

    // Phương thức cập nhật logic mỗi frame
    onUpdate(delta: number): void {}

    // Phương thức dọn dẹp khi scene kết thúc
    async onFinish(): Promise<void> {}
}

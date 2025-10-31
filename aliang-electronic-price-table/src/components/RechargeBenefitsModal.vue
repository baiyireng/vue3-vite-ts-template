<template>
    <div v-if="visible" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <img class="header_icon" :src="icon1" alt="" />
                <div class="title-container">
                    <h1>充值福利及礼物</h1>
                    <p>2025-06-14 15:18</p>
                </div>
                <button class="close-button" @click="closeModal">×</button>
            </div>

            <div class="modal-body">
                <div class="image-section">
                    <img :src="rechargeBenefitsImg" alt="充值福利及礼物" />
                </div>

                <div class="notice-section">
                    <h2>注意事项</h2>
                    <ul>
                        <li>个存只可消费固定陪</li>
                        <li>店存可转为个存超过520r，赠送陪陪微信*1</li>
                        <li>个存转店存需要扣除20%手续费</li>
                        <li>陪陪个存清空自愿保留绑板微信</li>
                        <li>备注：存单志择退款，退款需扣除20%服务费</li>
                    </ul>
                </div>
            </div>

            <div class="modal-footer">
                <div class="disclaimer_section">
                    <span class="weaken">本页面由</span>
                    <span class="emphasize">
                        <a
                            id="huoban-link"
                            href="https://lilihuyu.com"
                            target="_blank"
                            rel="noreferrer"
                        >
                            礼礼互娱
                        </a>
                    </span>
                    <span class="weaken">提供技术支持</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    visible: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const icon1 = new URL('@/assets/images/icon1.png', import.meta.url).href;
const rechargeBenefitsImg = new URL('@/assets/images/recharge_benefits.png', import.meta.url).href;

const closeModal = () => {
    emit('close');
};
</script>

<style scoped lang="less">
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 10px;
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    background-color: rgba(255, 255, 255, 0.65);
    position: sticky;
    top: 0;
    backdrop-filter: blur(20px);

    .header_icon {
        width: 60px;
        height: 60px;
        margin-right: 16px;
        object-fit: cover;
        border-radius: 9px;
    }

    .title-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;

        h1 {
            max-width: 100%;
            min-width: 400px;
            height: 38px;
            color: rgba(0, 0, 0, 0.85);
            text-overflow: ellipsis;
            word-break: break-word;
            white-space: nowrap;
            padding-top: 6px;
            font-size: 20px;
            font-weight: 600;
            line-height: 28px;
            overflow: hidden;
            margin: 0;
        }

        p {
            margin: 0;
            font-size: 14px;
            line-height: 22px;
            text-overflow: ellipsis;
            word-break: break-word;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .close-button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.modal-body {
    background-color: rgb(59 184 246 / 22%);
    padding: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex: 1;
}

.image-section {
    width: 45%;

    img {
        width: 100%;
        display: block;
    }
}

.notice-section {
    width: 45%;

    h2 {
        font-size: 20px;
        margin-top: 0;
    }

    ul {
        list-style-type: none;
        padding-left: 0;

        li {
            margin: 10px 0;
            padding-left: 1em;
            text-indent: -1em;

            &:before {
                content: '•';
                color: #333;
                display: inline-block;
                width: 1em;
            }
        }
    }
}

.modal-footer {
    padding: 20px;
    // border-top: 1px solid #eee;
    background-color: rgb(59 184 246 / 22%);

    .disclaimer_section {
        margin: 0;
        text-align: center;
        color: rgba(0, 0, 0, 0.45);
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
        justify-content: center;
        font-size: 12px;
        display: flex;

        .weaken {
        }

        #huoban-link {
            color: rgba(0, 0, 0, 0.65);
            margin: 0 4px;
            text-decoration: none;
            list-style: none;
        }
    }
}

@media screen and (max-width: 768px) {
    .modal-content {
        width: 95%;
        height: 95vh;
    }

    .modal-body {
        flex-direction: column;

        .image-section,
        .notice-section {
            width: 100%;
        }

        .image-section {
            margin-bottom: 20px;
        }
    }

    .modal-header {
        .title-container {
            h1 {
                min-width: auto;
                font-size: 18px;
            }
        }
    }
}
</style>
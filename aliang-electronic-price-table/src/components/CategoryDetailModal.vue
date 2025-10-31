<template>
    <div v-if="visible" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <img v-if="categoryData?.icon" class="header_icon" :src="categoryData.icon" alt="" />
                <img v-else class="header_icon" :src="defaultIcon" alt="" />
                <div class="title-container">
                    <h1>{{ categoryData?.name }}</h1>
                    <p v-if="categoryData?.updated_at">{{ categoryData?.updated_at }}</p>
                </div>
                <button class="close-button" @click="closeModal">×</button>
            </div>

            <div class="modal-body">
                <!-- 详情长图 -->
                <div v-if="categoryData?.detail_image" class="image-section">
                    <img :src="categoryData.detail_image" alt="详情长图" />
                </div>

                <!-- 注意事项 -->
                <div v-if="categoryData?.notice" class="notice-section">
                    <h2>注意事项</h2>
                    <div class="notice-content" v-html="categoryData?.notice"></div>
                </div>
            </div>

            <div class="modal-footer">
                <Footer />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { categoryAPI } from '@/api/index';
import Footer from '@/components/Footer.vue';

const props = defineProps<{
    visible: boolean;
    categoryId: number | null;
    categoryData: any;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

// const category = ref<any>(null);
const defaultIcon = new URL('@/assets/images/icon1.png', import.meta.url).href;

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

.modal-footer {
    padding: 20px;
    // border-top: 1px solid #eee;
    background-color: rgb(59 184 246 / 22%);
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

    .notice-content {
        :deep(ul) {
            padding-left: 20px;

            li {
                margin: 10px 0;
                line-height: 1.6;
                color: #666;
            }
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
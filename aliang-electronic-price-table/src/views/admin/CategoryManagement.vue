<template>
    <div class="category-management">
        <h2>品类管理</h2>

        <div class="actions">
            <el-button type="primary" @click="openEditModal('add')">添加品类</el-button>
        </div>

        <el-table :data="categories" style="width: 100%">
            <el-table-column prop="name" label="品类名称" width="180"></el-table-column>
            <el-table-column prop="description" label="描述" width="200"></el-table-column>
            <el-table-column label="图标" width="120">
                <template #default="scope">
                    <img v-if="scope.row.icon" :src="scope.row.icon" class="table-image" />
                    <span v-else>无图标</span>
                </template>
            </el-table-column>
            <el-table-column label="详情长图" width="120">
                <template #default="scope">
                    <img
                        v-if="scope.row.detail_image"
                        :src="scope.row.detail_image"
                        class="table-image"
                    />
                    <span v-else>无图片</span>
                </template>
            </el-table-column>
            <el-table-column prop="sort_order" label="排序" width="80"></el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="scope">
                    <el-button size="small" @click="openEditModal('edit', scope.row)"
                        >编辑</el-button
                    >
                    <el-button size="small" type="danger" @click="deleteCategory(scope.row.id)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑模态框 -->
        <div class="modal-overlay" v-if="showEditModal">
            <div class="modal">
                <div class="modal-header">
                    <h3>{{ modalTitle }}</h3>
                    <button class="close-button" @click="closeEditModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="saveCategory">
                        <div class="form-group">
                            <label for="categoryName">品类名称</label>
                            <input
                                id="categoryName"
                                v-model="editingCategory.name"
                                type="text"
                                class="form-control"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="categoryDescription">描述</label>
                            <textarea
                                id="categoryDescription"
                                v-model="editingCategory.description"
                                class="form-control"
                                rows="3"
                            ></textarea>
                        </div>

                        <div class="form-group">
                            <label>图标</label>
                            <div class="image-preview" @click="selectIcon">
                                <img
                                    :src="editingCategory.icon"
                                    alt="图标预览"
                                    v-if="editingCategory.icon"
                                />
                                <div class="no-image" v-else>点击上传图标</div>
                            </div>
                            <input
                                type="file"
                                ref="iconInput"
                                @change="handleIconUpload"
                                accept="image/*"
                                style="display: none"
                            />
                        </div>

                        <div class="form-group">
                            <label>详情长图</label>
                            <div class="image-preview" @click="selectDetailImage">
                                <img
                                    :src="editingCategory.detail_image"
                                    alt="详情长图预览"
                                    v-if="editingCategory.detail_image"
                                />
                                <div class="no-image" v-else>点击上传详情长图</div>
                            </div>
                            <input
                                type="file"
                                ref="detailImageInput"
                                @change="handleDetailImageUpload"
                                accept="image/*"
                                style="display: none"
                            />
                        </div>

                        <div class="form-group">
                            <label for="categoryNotice">注意事项（富文本）</label>
                            <div style="border: 1px solid #ccc; margin-top: 10px">
                                <Toolbar
                                    style="border-bottom: 1px solid #ccc"
                                    :editor="noticeEditorRef"
                                    :defaultConfig="toolbarConfig"
                                    :mode="mode"
                                />
                                <Editor
                                    style="height: 200px; overflow-y: hidden"
                                    v-model="editingCategory.notice"
                                    :defaultConfig="editorConfig"
                                    :mode="mode"
                                    @onCreated="handleNoticeCreated"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="categorySortOrder">排序</label>
                            <input
                                id="categorySortOrder"
                                v-model.number="editingCategory.sort_order"
                                type="number"
                                class="form-control"
                                min="0"
                            />
                        </div>

                        <div class="form-actions">
                            <button type="button" @click="closeEditModal" class="cancel-button">
                                取消
                            </button>
                            <button type="submit" class="save-button">保存</button>
                        </div>
                    </form>
                </div>
            </div>

            <div v-if="message" class="message" :class="{ error: isError }">
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount, onMounted, computed } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css';
import { categoryAPI } from '@/api/index';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

// 编辑器实例
const editorRef = ref();
const noticeEditorRef = ref();

const mode = ref('default');

// 工具栏配置
const toolbarConfig = {};

// 编辑器配置
const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
        uploadImage: {
            // 自定义图片上传
        },
    },
};

// 品类数据
const categories = ref([]);

// 编辑模态框相关
const showEditModal = ref(false);
const modalMode = ref<'add' | 'edit'>('add');

// 编辑中的品类
const editingCategory = reactive({
    id: 0,
    name: '',
    description: '',
    icon: '',
    detail_image: '',
    details: '',
    notice: '',
    sort_order: 0,
});

// 计算属性：模态框标题
const modalTitle = computed(() => {
    return modalMode.value === 'add' ? '添加品类' : '编辑品类';
});

// 图标上传输入框引用
const iconInput = ref<HTMLInputElement | null>(null);
const detailImageInput = ref<HTMLInputElement | null>(null);

// 消息提示
const message = ref('');
const isError = ref(false);

// 路由
const router = useRouter();

// 打开编辑模态框
const openEditModal = (mode: 'add' | 'edit', category?: any) => {
    modalMode.value = mode;
    if (mode === 'add') {
        // 重置表单
        Object.assign(editingCategory, {
            id: 0,
            name: '',
            description: '',
            icon: '',
            detail_image: '',
            details: '',
            notice: '',
            sort_order: categories.value.length + 1,
        });
    } else if (category) {
        // 填充表单数据
        Object.assign(editingCategory, { ...category });
    }
    showEditModal.value = true;
};

// 保存品类
const saveCategory = async () => {
    if (!editingCategory.name) {
        showMessage('请输入品类名称', true);
        return;
    }

    try {
        if (editingCategory.id) {
            // 更新现有品类
            await categoryAPI.update(editingCategory.id, editingCategory);
        } else {
            // 添加新品类
            await categoryAPI.create(editingCategory);
        }

        closeEditModal();
        showMessage('保存成功');
        fetchCategories(); // 重新获取品类列表
    } catch (error) {
        console.error('保存失败:', error);
        showMessage('保存失败', true);
    }
};

// 删除品类
const deleteCategory = async (id: number) => {
    if (confirm('确定要删除这个品类吗？')) {
        try {
            await categoryAPI.delete(id);
            showMessage('删除成功');
            fetchCategories(); // 重新获取品类列表
        } catch (error) {
            console.error('删除失败:', error);
            showMessage('删除失败', true);
        }
    }
};

// 上移品类
const moveCategoryUp = async (index: number) => {
    if (index > 0) {
        try {
            const currentCategory = categories.value[index];
            const prevCategory = categories.value[index - 1];

            // 交换排序
            await categoryAPI.updateSortOrder(currentCategory.id, prevCategory.sort_order);
            await categoryAPI.updateSortOrder(prevCategory.id, currentCategory.sort_order);

            fetchCategories(); // 重新获取品类列表
        } catch (error) {
            console.error('移动失败:', error);
            showMessage('移动失败', true);
        }
    }
};

// 下移品类
const moveCategoryDown = async (index: number) => {
    if (index < categories.value.length - 1) {
        try {
            const currentCategory = categories.value[index];
            const nextCategory = categories.value[index + 1];

            // 交换排序
            await categoryAPI.updateSortOrder(currentCategory.id, nextCategory.sort_order);
            await categoryAPI.updateSortOrder(nextCategory.id, currentCategory.sort_order);

            fetchCategories(); // 重新获取品类列表
        } catch (error) {
            console.error('移动失败:', error);
            showMessage('移动失败', true);
        }
    }
};

// 选择图标（触发文件选择）
const selectIcon = () => {
    const input = iconInput.value;
    if (input) {
        input.click();
    }
};

// 处理图标上传
const handleIconUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
        try {
            // 创建FormData对象用于上传文件
            const formData = new FormData();
            formData.append('image', file);

            // 上传图片到服务器
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.url) {
                // 更新图标URL
                editingCategory.icon = result.url;
                ElMessage.success('图标上传成功');
            } else {
                ElMessage.error('图标上传失败');
            }
        } catch (error) {
            console.error('上传失败:', error);
            ElMessage.error('上传失败: ' + (error as Error).message);
        }

        // 清空input值，以便下次选择同一文件也能触发change事件
        target.value = '';
    }
};

// 选择详情长图（触发文件选择）
const selectDetailImage = () => {
    const input = detailImageInput.value;
    if (input) {
        input.click();
    }
};

// 处理详情长图上传
const handleDetailImageUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
        try {
            // 创建FormData对象用于上传文件
            const formData = new FormData();
            formData.append('image', file);

            // 上传图片到服务器
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.url) {
                // 更新详情长图URL
                editingCategory.detail_image = result.url;
                ElMessage.success('详情长图上传成功');
            } else {
                ElMessage.error('详情长图上传失败');
            }
        } catch (error) {
            console.error('上传失败:', error);
            ElMessage.error('上传失败: ' + (error as Error).message);
        }

        // 清空input值，以便下次选择同一文件也能触发change事件
        target.value = '';
    }
};

// 关闭编辑模态框
const closeEditModal = () => {
    showEditModal.value = false;
};

// 显示消息
const showMessage = (msg: string, error: boolean = false) => {
    message.value = msg;
    isError.value = error;

    setTimeout(() => {
        message.value = '';
    }, 3000);
};

// 从后端获取品类列表
const fetchCategories = async () => {
    try {
        const response = await categoryAPI.getAll();
        if (response.categories) {
            categories.value = response.categories;
        }
    } catch (error) {
        console.error('获取品类列表失败:', error);
        showMessage('获取品类列表失败', true);
    }
};

// 退出登录
const handleLogout = () => {
    // 清除本地存储的token和用户信息
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');

    // 跳转到登录页
    router.push('/admin/login');
};

// 编辑器创建回调
const handleCreated = (editor: any) => {
    editorRef.value = editor;
};

// 详情内容编辑器创建回调
const handleDetailsCreated = (editor: any) => {
    detailsEditorRef.value = editor;
};

// 注意事项编辑器创建回调
const handleNoticeCreated = (editor: any) => {
    noticeEditorRef.value = editor;
};

// 组件挂载时获取数据
onMounted(() => {
    fetchCategories();
});

// 组件销毁时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();

    const noticeEditor = noticeEditorRef.value;
    if (noticeEditor == null) return;
    noticeEditor.destroy();

    const detailsEditor = detailsEditorRef.value;
    if (detailsEditor == null) return;
    detailsEditor.destroy();
});
</script>

<style scoped lang="less">
.category-management {
    padding: 20px;

    h2 {
        color: #333;
        margin-bottom: 20px;
    }

    .actions {
        margin-bottom: 20px;
        text-align: right;
    }

    .table-image {
        max-width: 80px;
        max-height: 80px;
        object-fit: cover;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal {
        background: white;
        border-radius: 8px;
        width: 800px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;

            h3 {
                margin: 0;
                color: #333;
            }

            .close-button {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;

                &:hover {
                    color: #333;
                }
            }
        }

        .modal-body {
            padding: 20px;

            .form-group {
                margin-bottom: 20px;

                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #333;
                }

                .form-control {
                    width: 100%;
                    padding: 12px 15px;
                    border: 1px solid #dcdfe6;
                    border-radius: 4px;
                    box-sizing: border-box;
                    font-size: 14px;
                    transition: border-color 0.3s;

                    &:focus {
                        outline: none;
                        border-color: #409eff;
                        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
                    }

                    &::placeholder {
                        color: #c0c4cc;
                    }
                }

                textarea.form-control {
                    resize: vertical;
                }

                .image-preview {
                    width: 100%;
                    height: 150px;
                    border: 2px dashed #d9d9d9;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    overflow: hidden;
                    position: relative;

                    &:hover {
                        border-color: #409eff;
                    }

                    img {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: cover;
                    }

                    .no-image {
                        color: #999;
                        font-size: 14px;
                    }
                }
            }

            .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 30px;

                .cancel-button,
                .save-button {
                    padding: 12px 30px;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .cancel-button {
                    background-color: #f5f5f5;
                    color: #333;

                    &:hover {
                        background-color: #e0e0e0;
                    }
                }

                .save-button {
                    background-color: #409eff;
                    color: white;

                    &:hover {
                        background-color: #66b1ff;
                    }
                }
            }
        }
    }

    .message {
        margin-top: 20px;
        padding: 10px 15px;
        border-radius: 4px;
        text-align: center;

        &.error {
            background-color: #fef0f0;
            color: #f56c6c;
            border: 1px solid #fde2e2;
        }

        &:not(.error) {
            background-color: #f0f9eb;
            color: #67c23a;
            border: 1px solid #e1f3d8;
        }
    }
}
</style>
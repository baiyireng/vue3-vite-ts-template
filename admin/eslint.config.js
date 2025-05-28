// 导入必要插件和解析器
import js from '@eslint/js';
import vuePlugin from 'eslint-plugin-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueEslintParser from 'vue-eslint-parser'; // 新增 Vue 解析器

export default [
    // 基础 JS 规则（直接展开 @eslint/js 推荐规则）
    {
        files: ['**/*.js'],
        ...js.configs.recommended,
        rules: {
            ...js.configs.recommended.rules,
            semi: ['warn', 'always'], // 显式覆盖分号规则
        },
    },

    // Vue 文件配置（手动展开 eslint-plugin-vue 推荐规则）
    {
        files: ['**/*.vue'],
        plugins: { vue: vuePlugin },
        languageOptions: {
            parser: vueEslintParser, // Vue 文件专用解析器
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                parser: tsParser, // 嵌套解析 TS 代码
            },
        },
        rules: {
            ...vuePlugin.configs.recommended.rules, // 展开 Vue 推荐规则
            'vue/multi-word-component-names': 'off', // 关闭组件名多单词限制（自定义规则）
            semi: ['warn', 'always'], // 分号规则
        },
    },

    // TypeScript 文件配置（手动展开 @typescript-eslint 推荐规则）
    {
        files: ['**/*.ts'],
        plugins: { '@typescript-eslint': tsPlugin },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        rules: {
            ...tsPlugin.configs.recommended.rules, // 展开 TS 推荐规则
            '@typescript-eslint/no-unused-vars': 'warn', // 自定义未使用变量规则
            semi: ['warn', 'always'], // 分号规则
        },
    },
];

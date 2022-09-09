<template>
	<el-dialog custom-class="nodeDialog" v-model="dialogVisible" title="导入">
		<el-upload ref="upload" action="x" :file-list="fileList" :auto-upload="false" :multiple="false"
			:on-change="onChange" :limit="1" :on-exceed="onExceed">
			<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
			<div slot="tip" class="el-upload__tip">只能上传.smm文件</div>
		</el-upload>
		<span slot="footer" class="dialog-footer">
			<el-button @click="cancel">取 消</el-button>
			<el-button type="primary" @click="confirm">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script setup>
/**
* @Author: 黄原寅
* @Desc: 导入功能
*/
import { onMounted, ref, watch } from 'vue'
import bus from "@/utils/bus.js"
import { ElMessage } from "element-plus";

const dialogVisible = ref(false)
const fileList = ref([])

watch(() => dialogVisible.value, (val, oldVal) => {
	if (!val && oldVal) {
		fileList.value = [];
	}
})

onMounted(() => {
	bus.on("showImport", () => {
		dialogVisible.value = true;
	});
})

/**
 * @Author: 黄原寅
 * @Desc: 文件选择
 */
const onChange = (file) => {
	let reg = /\.smm$/;
	if (!reg.test(file.name)) {
		ElMessage({
			message: "请选择.smm文件",
			type: "error",
		});
		fileList.value = [];
	} else {
		fileList.value.push(file)
	}
}

/**
 * @Author: 黄原寅
 * @Desc: 数量超出限制
 */
const onExceed = () => {
	ElMessage({
		message: "最多只能选择一个文件",
		type: "warning",
	});
}

/**
 * @Author: 黄原寅
 * @Desc: 取消
 */
const cancel = () => {
	dialogVisible.value = false;
}

/**
 * @Author: 黄原寅
 * @Desc: 确定导入
 */
const confirm = () => {
	if (fileList.value.length <= 0) {
		return ElMessage({
			message: "请选择要导入的文件",
			type: "warning",
		});
	}
	let file = fileList.value[0];
	let fileReader = new FileReader()
	fileReader.readAsText(file.raw)
	fileReader.onload = (evt) => {
		try {
			let data = JSON.parse(evt.target.result)
			if (typeof data !== 'object') {
				throw new Error('文件内容有误')
			}
			bus.emit('setData', data)
			ElMessage({
				message: "导入成功",
				type: "success",
			});
		} catch (error) {
			console.log(error)
			ElMessage({
				message: "文件解析失败",
				type: "error",
			});
		}
	}
	cancel();
}
</script>

<script>
export default {
	name: "Import",
};
</script>

<style lang="less" scoped>
.nodeDialog {}
</style>

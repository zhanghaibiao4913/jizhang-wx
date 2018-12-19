<template>
  <div class="category-page" v-if="toggle">
		<div class="mask">
			<div class="content">
				<div class="list-wrapper">
					<div class="item" v-for="item in categoryData" :key="item.cid" 
					:class="{ active: currentItem.cid == item.cid}"
					@click="select(item)">{{item.cname}}
					</div>
				</div>
				<div class="btns-wrapper">
					<div class="btn cancel-btn" @click="handleCancel">取消</div>
					<div class="btn confirm-btn" @click="handleConfirm">确定</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
export default {
	props: ['toggle', 'categoryData', 'activeItem', 'confirm'],
  data(){
		return {
			
		}
	},
	computed: {
		currentItem: function() {
			return this.activeItem;
		}
	},
	methods:{ 
		handleConfirm() {
			this.$emit('confirm', this.currentItem);
		},
		handleCancel() {
			this.$emit('cancel');
		},
		select(item) {
			this.activeItem = item;
		}
	}
}
</script>

<style lang="scss" scoped>
@import "./category.scss";
</style>

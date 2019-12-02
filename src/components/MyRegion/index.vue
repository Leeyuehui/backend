<template>
  <el-cascader
  :options="options"
  v-model="regionModel"
  @change="onChange"
></el-cascader>
</template>
<script>
    export default{
        props:["model"],
        data(){
            return {
                url:BASE_URL+"/f10107",
                area:'',
                options:[],
                regionModel:[],
            }
        },
        methods:{
             onChange(item){
                 this.$emit("update:model",item[2])
             },
             setOption(){
                 this.$http.post("static/region.json",(data,res)=>{
                        this.options = data
                 })
             }

        },
        created(){
            this.setOption()
        },
        watch:{
            model(newValue,oldValue){
                console.log(newValue)
                if(newValue){
                    this.$http.post("f80708",{id:newValue},(data,res)=>{
                        this.regionModel = data;
                    })
                }
            }
        }
    }
</script>
<style>
.el-autocomplete{
    width:100%
}
</style>

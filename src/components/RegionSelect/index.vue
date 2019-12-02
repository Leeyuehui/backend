<template>
<div class="regionSelect">
    <el-select v-model="pro" placeholder="请选择省">
    <el-option
      v-for="item in proOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-select v-model="city" placeholder="请选择市">
    <el-option
      v-for="item in cityOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-select v-model="area" placeholder="请选择区">
    <el-option
      v-for="item in areaOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <br>
  或者具体小区(上下不填默认所有小区)
    <my-area ref="area" :model.sync="areaId"></my-area>
</div>
</template>
<script>
import MyArea from '@/components/MyArea'
export default{
        props:["model"],
        components:{
            MyArea
        },
        data(){
            return {
                url:BASE_URL+"/f10107",
                areaId:"",
                options:[],
                regionModel:[],
                proOptions: [],
                cityOptions: [],
                areaOptions: [],
                pro:"",
                city:"",
                area:"",
            }
        },
        methods:{
             onChange(item){
                 this.$emit("update:model",item[2])
             },
             setOption(){
                 this.$http.post("static/region.json",(data,res)=>{
                        this.options = data;
                        this.setProOption()
                 })
             },
             setProOption(){
                 this.proOptions = this.options

             },
             setCityOption(id){
                 this.proOptions.map((res)=>{
                     if(res.value == id){
                         this.cityOptions = res.children;
                         return ;
                     }
                 })
             },
             setAreaOption(id){
                 this.cityOptions.map((res)=>{
                     if(res.value == id){
                         this.areaOptions = res.children;
                         return ;
                     }
                 })
             }

        },
        created(){
            this.setOption()
        },
        watch:{
            pro(val){
                this.setCityOption(val)
                this.city = ""
                this.$refs.area.clear()
                this.$emit("update:model", val);
            },
            city(val){
                this.setAreaOption(val);
                this.area = ""
                this.$refs.area.clear()
                this.$emit("update:model", val);
            },
            area(val){
                this.$refs.area.clear()
                this.$emit("update:model", val);
            },
            model(newValue,oldValue){
                if(!newValue){
                    this.pro = ""
                }else{

                }
                
            },
            areaId(n,o){
                if(n){
                    this.pro = ""
                    this.$emit("update:model", 'a'+n);
                }
            }
            
        },
        created(){
            this.setOption()
        }
    }
</script>
<style>
.el-autocomplete{
    width:100%
}
.regionSelect .el-select{
    width:25%;
}
</style>

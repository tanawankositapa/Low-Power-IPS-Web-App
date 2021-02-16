<template lang="">

<div class="layout-content wrapper ">
    <div class="content-section implementation wrapper">
    <div class="card content">
        <div class="container">
            <div class="p-fluid">
    <div class="p-field">
        <label for="firstname">Username</label>
        <InputText id="firstname" type="text" />
    </div>
    <div class="p-field">
        <label for="lastname">Password</label>
        <InputText id="lastname" type="text" />
    </div>
</div>

        <div class="p-field p-grid">
            <Button class="navBtn p-mt-2" label="Login" />
        </div>
        </div>
    </div>
    </div>
</div>

</template>
<script>
export default {
    
}
</script>
<style scoped>
.wrapper{
    height: 100%;
}
.content{
    margin-top: 150px;
    margin-left: 35%;
    margin-right: 40%;
}
.navBtn{
    margin-left: 74%;
}
    
</style>
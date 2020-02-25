<template>
    <div class="about">
        <div class="header">
            <div class="title">
                <div class="welcome">
                    <span style="font-size: 2em">AchieveIt 软件项目管理平台</span>
                </div>
                <p class="desc">
                    AchieveIt支持项目的基本情况、项目成员、项目成员权限、项目所需完成功能、项目状态等信息的管理和查询、能够执行项目立项流程和 归档流程。除此以外，AchieveIt
                    最好还能够跟踪评审问题和缺陷，提供项目风险，项目设备，项目成员工时等信息的管理和查询。为此，AchieveIt 需要从公司已有的客户
                    关系系统，人事管理系统，成本管理系统等获取客户，人员等基本信息。同时，AchieveIt 也会向公司的配置管理系统输出配置访问权限信息以便进行项目资产的访问控制。
                </p>
            </div>
        </div>
        <div class="team">
            <div class="team-detail">
                <div class="team-box">
                    <div class="team-title">技术架构</div>
                    <ul class="team-ul">
                        <li>
              <span class="shadow-box">
                <i class="team-shadow"></i>
              </span>
                            <span class="team-role">前端</span>
                            <span class="team-name">Vue</span>
                        </li>
                        <li>
              <span class="shadow-box">
                <i class="team-shadow"></i>
              </span>
                            <span class="team-role">后端</span>
                            <span class="team-name">Spring-Boot MySQL</span>
                        </li>
                        <li>
              <span class="shadow-box">
                <i class="team-shadow"></i>
              </span>
                            <span class="team-role">UI组件</span>
                            <span class="team-name">Element-UI</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="official-account">
                <div class="official-account-box">
                    <p>软件开发实践课程项目</p>
                    <p>指导教师：姜宁康 孙海英 毛宏燕</p>
                    <p>项目组成员：孙雨晶 侯峂欣 卢苇 龙万成 刘少彬 陈佳蕾</p>
                </div>
                <div class="team-icon">
                    <img src="../../assets/img/about/team-icon.png" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

    .about {
        padding: 30px;

        .header {
            width: 100%;
            height: 180px;
            background-color: #E9F0FF;
            background-image: url('../../assets/img/about/header-bg.png');
            background-position: 100%;
            background-repeat: no-repeat;
            background-size: 34% 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .title {
                padding: 0 0 52px 40px;
                display: flex;
                flex-direction: column;
                justify-content: center;

                .welcome {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    height: 31px;
                    cursor: pointer;

                    img {
                        width: 356px;
                        height: 31px;
                    }

                    .version {
                        display: inline-block;
                        margin-left: 15px;
                        height: 12px;
                        line-height: 12px;
                        font-size: 12px;
                        color: #8C98AE;
                        text-indent: 5px;
                        border-left: 1px solid #8C98AE;
                        transform: translateY(15px);
                    }
                }

                .desc {
                    margin-top: 14px;
                    height: 20px;
                    line-height: 20px;
                    font-size: 14px;
                    width: 70%;
                    color: #8C98AE;

                    span {
                        color: $theme;
                        margin-left: 10px;
                    }
                }
            }
        }

        .team {
            margin-top: 30px;
            height: 200px;
            width: 100%;
            display: flex;
            flex: 1;

            .team-detail {
                position: relative;
                background-color: #E9F0FF;
                width: 600px;
                height: 100%;

                .team-box {
                    padding: 35px 42px;

                    .team-ul {
                        margin-top: 20px;

                        li {
                            height: 20px;
                            line-height: 20px;
                            margin-bottom: 15px;
                            font-size: 14px;

                            .shadow-box {
                                position: relative;
                                display: inline-block;
                                margin-right: 10px;
                                width: 14px;
                                height: 14px;
                                border-radius: 14px;
                                background-color: #DCE7FF;
                                transform: translateY(2px);

                                .team-shadow {
                                    position: absolute;
                                    top: 25%;
                                    left: 25%;
                                    display: inline-block;
                                    width: 6px;
                                    height: 6px;
                                    border-radius: 6px;
                                    background-color: #75A1FF;
                                }
                            }

                            .team-role {
                                display: inline-block;
                                width: 60px;
                                margin-right: 15px;
                                font-weight: 400;
                                color: #45526B;
                            }

                            .team-name {
                                font-weight: 400;
                                color: #8C98AE;

                                ul {
                                    display: inline;

                                    li {
                                        display: inline;
                                        margin-right: 20px;
                                    }
                                }
                            }
                        }
                    }

                }

                .team-icon {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 80px;
                    height: 80px;
                    background-color: #fff;
                    border-radius: 40px;
                    box-shadow: 0 0 30px 0 #CFD5E3;

                    img {
                        position: absolute;
                        top: 14px;
                        left: 20px;
                        width: 40px;
                        height: 46px;
                    }
                }
            }

            .official-account {
                margin-left: 30px;
                display: flex;
                flex: 1;
                flex-direction: column;
                justify-content: center;
                background-color: #E9F0FF;
                height: 100%;
                position: relative;

                .official-account-box {
                    padding: 0 35px;
                    margin: 0 auto;

                    img {
                        width: 100px;
                        height: 100px;
                        margin: 0 auto;
                    }

                    p {
                        height: 20px;
                        line-height: 20px;
                        margin-top: 10px;
                        font-size: 14px;
                        font-weight: 400;
                        color: #45526B;
                    }
                }

                .team-icon {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 80px;
                    height: 80px;
                    background-color: #fff;
                    border-radius: 40px;
                    box-shadow: 0 0 30px 0 #CFD5E3;

                    img {
                        position: absolute;
                        top: 14px;
                        left: 20px;
                        width: 40px;
                        height: 46px;
                    }
                }
            }
        }
    }
</style>

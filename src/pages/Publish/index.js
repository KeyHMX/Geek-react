import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import "./index.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {  useEffect, useState } from "react";

import { creaeteArticleAPI, getArticleById, updateArticleAPI } from "@/apis/article";
import { useChannel } from "@/hooks/useChannel";

const { Option } = Select;

const Publish = () => {
  //频道列表
  const {channelList} = useChannel()
  //上传图片
  const [imageList,setImageList] = useState([])
  //控制表单渲染的id
  const [imageType,setImageType] = useState(0)
  //调用接口得到表单列表
  
  //提交表单
  const onFinish = async (formValue) => {
    console.log(formValue);
    //校验图片是否符合，不匹配不能提交
    if(imageList.length!==imageType) return message.warning('图片数量不符')
    
    const { title, content, channel_id } = formValue;
    //按照接口文档的格式处理收集到的表单数据
    const reqData = {
      title,
      content,
      cover: {
        type: imageType,
        //这里的url处理只适配于新增的时候
        //编辑的时候也要适配
        images: imageList.map(
          item=>{
            if(item.response){
              return item.response.data.url
            }else{
              return item.url
            }
          }
        )
      },
      channel_id,
    };
    //新增-新增接口 编辑 - 编辑接口
    if (articleId){
      //调用编辑接口
      await updateArticleAPI({...reqData,id:articleId})
    }else{
      await creaeteArticleAPI(reqData);
    }
    
    message.success("发布文章成功");
  };
  const onUploadChange = (info)=>{
    console.log(info)
    setImageList(info.fileList)
  }
  //图片选择
  const onTypeChange = (e)=>{
    const target = e.target.value
    setImageType(target)
  }

  //回填数据
  const [searchParams] = useSearchParams()
  const articleId = searchParams.get('id')
  const [form] =Form.useForm()
  console.log(articleId)
  useEffect(()=>{
    //通过id获取数据
      async function getArticleDetail(){
        const res = await getArticleById(articleId)
        form.setFieldsValue({
          ...res.data,
          type:res.data.cover.type

        })//注意要加s
        setImageType(res.data.cover.type)
        setImageList(res.data.cover.images.map(url=>{
          return {url}
        }))
      }
      //article在才回填
      if(articleId){
        getArticleDetail()
      }
      
    //调用实例方法，完成回填
  },[articleId,form])
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={"/"}>首页</Link> },
              { title: `${articleId?'编辑':'发布'}文章` },
            ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageType>0 &&
            <Upload
            showUploadList
            name="image"
            listType = "picture-card"
            action={'http://geek.itheima.net/v1_0/upload'}
            onChange={onUploadChange}
            maxCount={imageType}
            // multiple={imageType>1}
            fileList={imageList}//绑定图片
            >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>}
            
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;

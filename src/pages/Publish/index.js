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
import { Link } from "react-router-dom";
import "./index.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {  useState } from "react";

import { creaeteArticleAPI } from "@/apis/article";
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
        images: imageList.map(item=>item.response.data.url),
      },
      channel_id,
    };
    await creaeteArticleAPI(reqData);
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
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={"/"}>首页</Link> },
              { title: "发布文章" },
            ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0 }}
          onFinish={onFinish}
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

import { Link } from "react-router-dom";
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  DatePicker,
  Select,
} from "antd";
import locale from "antd/es/date-picker/locale/zh_CN";

// 导入资源
import { Table, Tag, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import img404 from "@/assets/error.png";
import { useChannel } from "@/hooks/useChannel";
import { useEffect, useState } from "react";
import { delArticleAPI, getArticleListAPI } from "@/apis/article";
import {Popconfirm} from 'antd'
import {useNavigate} from 'react-router-dom'
const { Option } = Select;
const { RangePicker } = DatePicker;

const Article = () => {
  //删除的弹窗
  const onConfirm = async (data)=>{
    console.log('删除点击了',data)
    await delArticleAPI(data.id)
    //这里报错了并不ok初步怀疑
    //好吧我是小丑，这里只是没有进行同步异步的操作可见同步异步的重要性了
    setReqData({
      ...reqData
    })
  }

  const navigate = useNavigate()
  //2 初始化用户选择的表单数据
  //注意这里要用中括号不能用大括号，因为并非解构，而且reqData已经是一个对象了
  const [reqData, setReqData] = useState({
    status: "",
    channel_id: "",
    begin_pubdate: "",
    end_pubdate: "",
    page: 1,
    per_page: 4,
  });
  // 准备列数据
  const status = {
    1: <Tag color="warning">待审核</Tag>,
    2: <Tag color="success">审核通过</Tag>,
  };
  const columns = [
    {
      title: "封面",
      dataIndex: "cover",
      width: 120,
      render: (cover) => {
        return (
          <img src={cover.images[0] || img404} width={80} height={60} alt="" />
        );
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      width: 220,
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (data) => status[data],
    },
    {
      title: "发布时间",
      dataIndex: "pubdate",
    },
    {
      title: "阅读数",
      dataIndex: "read_count",
    },
    {
      title: "评论数",
      dataIndex: "comment_count",
    },
    {
      title: "点赞数",
      dataIndex: "like_count",
    },
    {
      title: "操作",
      render: (data) => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>navigate(`/publish?id=${data.id}`)} />
            <Popconfirm
              title="删除文章"
              description="确定删除？"
              onConfirm={()=>onConfirm(data)}
              
              okText="Yes"
              cancelText="No"
            >
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  //分页操作
  const onPageChange = (page) => {
    console.log(page);
    setReqData({
      ...reqData,
      page,
    });
  };

  //获取频道列表
  const { channelList } = useChannel();
  //获取文章列表
  const [list, setList] = useState([]);
  //渲染总数
  const [count, setCount] = useState(0);
  useEffect(() => {
    async function getlist() {
      const res = await getArticleListAPI(reqData);
      setList(res.data.results);
      setCount(res.data.total_count);
    }
    getlist();

    console.log(reqData);
  }, [reqData]);
  //筛选参数
  //1 准备参数

  //2 获取用户选择的表单数据
  const onFinish = (formValue) => {
    //onfinish这里有问题，筛选不出来，table的oayload里面没有任何值
    console.log(formValue);
    setReqData({
      ...reqData,
      begin_pubdate: formValue.date[0].format("YYYY-MM-DD"),
      end_pubdate: formValue.date[1].format("YYYY-MM-DD"),
      channel_id: formValue.channel_id,
      status: formValue.status,
    });
    //重新拉取文章列表+渲染table逻辑重复的 - 复用
    //reqData依赖项发生变化 重复执行副作用函数
    console.log(reqData);
  };

  return (
    <div>
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={"/"}>首页</Link> },
              { title: "文章列表" },
            ]}
          />
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: "" }} onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={""}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={2}>审核通过</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select placeholder="请选择文章频道" style={{ width: 200 }}>
              {channelList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 表格区域 */}
      <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={{
            total: count,
            pageSize: reqData.per_page,
            onChange: onPageChange,
          }}
        />
      </Card>
    </div>
  );
};

export default Article;

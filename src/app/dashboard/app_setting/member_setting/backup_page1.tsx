// 做了會員有效期 / 續會方式 / 會員期結束的處理
// 想在下方加 獲取積分的 form
// // src/app/dashboard/app_setting/member_setting/page.tsx

// 'use client'

// import React, { useState } from 'react';
// import {
//     Button,
//     Cascader,
//     DatePicker,
//     Form,
//     Input,
//     InputNumber,
//     Mentions,
//     Select,
//     TreeSelect,
//     Segmented,
// } from 'antd';
// import { Typography } from 'antd';
// const { Title } = Typography;
// import type { FormProps } from 'antd';
// import { blue, purple } from '@ant-design/colors';

// const handleChange = (value: string) => {
//     console.log(`selected ${value}`);
// };


// const { RangePicker } = DatePicker;

// const formItemLayout = {
//     labelCol: {
//         xs: { span: 24 },
//         sm: { span: 6 },
//     },
//     wrapperCol: {
//         xs: { span: 24 },
//         sm: { span: 14 },
//     },
// };

// const membership_period = [
//     { value: '1', label: '1' },
//     { value: '2', label: '2' },
//     { value: '3', label: '3' },
//     { value: '4', label: '4' },
//     { value: '5', label: '5' },
// ]


// const membership_extend_method = [
//     { value: '1', label: '購物滿一定金額，開啟續會按鈕。' },
//     { value: '2', label: '只需詢問顧客意願，無條件續會。' },
// ]

// const membership_end_result = [
//     { value: '1', label: '會員期結束，會員擁有的積分及禮遇會失效' },
//     { value: '2', label: '會員期結束，會員擁有的積分及禮遇不會失效，續會後可繼續使用。' },
// ]


// const MemberSetting: React.FC = function MemberSetting() {
//     // const [componentVariant, setComponentVariant] = useState<FormProps['variant']>('filled');

//     // const onFormVariantChange = ({ variant }: { variant: FormProps['variant'] }) => {
//     //   setComponentVariant(variant);
//     // };

//     return (

//         <Form
//             {...formItemLayout}
//         // onValuesChange={onFormVariantChange}
//         // variant={componentVariant}
//         // style={{ maxWidth: 600 }}
//         // initialValues={{ variant: componentVariant }}

//         >
//             <div style={{ display: 'flex', justifyContent: 'center' }}>
//                 <Title level={2} style={{ backgroundColor: purple[1], padding: '1rem' }}>
//                     會員基本設定
//                 </Title>
//             </div>
//             {/* <Form.Item label="Form variant" name="variant">
//         <Segmented options={['outlined', 'filled', 'borderless']} />
//       </Form.Item> */}


//             <Form.Item label="會員有效期" name="membership_period" rules={[{ required: true, message: '請選擇會員有效期' }]}>
//                 <Select
//                     defaultValue="1"
//                     style={{ width: 70 }}
//                     allowClear
//                     options={membership_period}
//                     placeholder="select it"
//                 /> 年
//             </Form.Item>

//             <Form.Item
//                 label="續會方式"
//                 name="membership_extend_method"
//                 rules={[{ required: true, message: '請選擇續會方式' }]}
//             >
//                 <Select
//                     defaultValue="2"
//                     style={{ width: 600 }}
//                     allowClear
//                     options={membership_extend_method}
//                     placeholder="select it"
//                 />
//             </Form.Item>

//             <Form.Item
//                 label="會員期結束的處理"
//                 name="membership_end_result"
//                 rules={[{ required: true, message: '請選擇會員期結束的處理' }]}
//             >
//                 <Select
//                     defaultValue="1"
//                     style={{ width: 600 }}
//                     allowClear
//                     options={membership_end_result}
//                     placeholder="select it"
//                 />
//             </Form.Item>
            
//             <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
//                 <Button type="primary" htmlType="submit">
//                     Submit
//                 </Button>
//             </Form.Item>
//         </Form>

//     );
// };

// export default MemberSetting;
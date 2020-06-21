import React from "react";
import { Form, Input, Button } from "antd";

export const UserCreateForm = Form.create({ name: "form_in_modal" })(
  class extends React.Component {
    render() {
      const { handleSubmit, form, confirmLoading } = this.props;
      const { getFieldDecorator } = form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      };

      return (
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Form.Item label="Name">
            {getFieldDecorator("name", {rules: [{ required: true}]})(<Input placeholder="Name" />)}
          </Form.Item>
          <Form.Item label="Email">
            {getFieldDecorator("email", {rules: [{ required: true, type: 'email' }]})(<Input placeholder="Email" />)}
          </Form.Item>
        </Form>
      );
    }
  }
);

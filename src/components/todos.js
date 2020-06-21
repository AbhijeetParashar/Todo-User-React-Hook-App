import React from "react";
import { connect } from "react-redux";
import {Table,Input,Button,Popconfirm,Form,Tabs,InputNumber,Divider} from "antd";
import {fetchUsersTodos,addTodo,addUser,editTodo,editUser,deleteTodo,deleteUser} from "../actions/actions";
import "./todos.css";
import { PopupModal } from "./utils/PopupModal";
import TopBar from "../core/TopBar"

const EditableContext = React.createContext();

const { TabPane } = Tabs;

function callback(key) {
}

const userModal = "User";
const todoModal = "Todo";

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === "number") {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {editing, dataIndex,title,inputType,record,index,children,...restProps} = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

class ToDos extends React.Component {
  constructor(props) {
    super(props);

    this.todo_columns = [
      {
        title: "Action",
        dataIndex: "action",
        width: "41%",
        editable: true
      },
      {
        title: "DateAdded",
        dataIndex: "dateadded",
        width: "41%",
        editable: true
      },
      {
        title: "Action",
        dataIndex: "operation",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isTodoEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.saveTodo(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Update
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="Sure to cancel?"
                onConfirm={() => this.cancelTodo(record.key)}
              >
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <div>
              <a
                disabled={this.state.editingTodoKey !== ""}
                onClick={() => this.editTodo(record.key)}
              >
                Edit
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.deleteTodo(record.key)}
              >
                <a>Delete</a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];

    this.user_columns = [
      {
        title: "Name",
        dataIndex: "name",
        width: "41%",
        editable: true
      },
      {
        title: "Email",
        dataIndex: "email",
        width: "41%",
        editable: true
      },
      {
        title: "Action",
        dataIndex: "operation",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isUserEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.saveUser(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Update
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="Sure to cancel?"
                onConfirm={() => this.cancelUser(record.key)}
              >
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <div>
              <a
                disabled={this.state.editingUserKey !== ""}
                onClick={() => this.editUser(record.key)}
              >
                Edit
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.deleteUser(record.key)}
              >
                <a>Delete</a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];

    this.state = {
      users: [],
      editingUserKey: "",
      editingTodoKey: "",
      userCount: 0,
      todoCount: 0,
      todos: [],
      visible: false,
      confirmLoading: false
    };
    this.addType = "";
  }

  componentDidMount() {
    this.props.fetchUsersTodos();
  }

  isUserEditing = record => record.key === this.state.editingUserKey;
  isTodoEditing = record => record.key === this.state.editingTodoKey;

  deleteUser = key => {
    this.props.deleteUser(key);
  };

  deleteTodo = key => {
    this.props.deleteTodo(key);
  };

  cancelUser = () => {
    this.setState({ editingUserKey: "" });
  };

  cancelTodo = () => {
    this.setState({ editingTodoKey: "" });
  };

  editUser(key) {
    this.setState({ editingUserKey: key });
  }

  editTodo(key) {
    this.setState({ editingTodoKey: key });
  }

  saveUser(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      this.setState({ editingUserKey: "" });
      this.props.editUser(key, row);
    });
  }

  saveTodo(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      this.setState({ editingTodoKey: "" });
      this.props.editTodo(key, row);
    });
  }

  addUser = () => {
    this.addType = userModal;
    this.showModal();
  };

  addTodo = () => {
    this.addType = todoModal;
    this.showModal();
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.setState({
      confirmLoading: true
    });

    setTimeout(() => {
      const { form } = this.formRef.props;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        if (this.addType === todoModal) {
          const fieldsValue = {
            ...values,
            dateadded: values["dateadded"].format("YYYY-MM-DD HH:mm:ss")
          };
          this.props.addTodo(fieldsValue);
        } else {
          this.props.addUser(values);
        }
      });

      this.setState({
        visible: false,
        confirmLoading: false
      });
    }, 2000);
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { users, todos } = this.props;

    const components = {
      body: {
        cell: EditableCell
      }
    };

    const todo_columns = this.todo_columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === "key" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isTodoEditing(record)
        })
      };
    });

    const user_columns = this.user_columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === "key" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isUserEditing(record)
        })
      };
    });

    return (
      <div>
        <TopBar 
          title={"Todos and User Records"}
        />
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Todos" key="1">
            <div>
              <Button
                onClick={this.addTodo}
                type="primary"
                style={{ marginBottom: 16 }}
              >
                Add Todo
              </Button>

              <EditableContext.Provider value={this.props.form}>
                <Table
                  components={components}
                  bordered
                  dataSource={todos.todos}
                  columns={todo_columns}
                  rowClassName="editable-row"
                  pagination={{
                    onChange: this.cancelTodo,
                    pageSize:5
                  }}
                />
              </EditableContext.Provider>
            </div>
          </TabPane>
          <TabPane tab="Users" key="2">
            <div>
              <Button
                onClick={this.addUser}
                type="primary"
                style={{ marginBottom: 16 }}
              >
                Add User
              </Button>

              <EditableContext.Provider value={this.props.form}>
                <Table
                  components={components}
                  bordered
                  dataSource={users.users}
                  columns={user_columns}
                  rowClassName="editable-row"
                  pagination={{
                    onChange: this.cancelUser,
                    pageSize:5
                  }}
                />
              </EditableContext.Provider>
            </div>
          </TabPane>
        </Tabs>
        <PopupModal
          visible={this.state.visible}
          onCancel={this.hideModal}
          onCreate={this.handleSubmit}
          confirmLoading={this.state.confirmLoading}
          wrappedComponentRef={this.saveFormRef}
          addType={this.addType}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.users,
    todos: state.todos
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUsersTodos: () => {
      dispatch(fetchUsersTodos());
    },
    addTodo: data => {
      dispatch(addTodo(data));
    },
    editTodo: (key, data) => {
      dispatch(editTodo(key, data));
    },
    deleteTodo: key => {
      dispatch(deleteTodo(key));
    },
    addUser: data => {
      dispatch(addUser(data));
    },
    editUser: (key, data) => {
      dispatch(editUser(key, data));
    },
    deleteUser: key => {
      dispatch(deleteUser(key));
    }
  };
};
const UserTodoCreateForm = Form.create()(ToDos);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTodoCreateForm);

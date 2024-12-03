import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator(); // Lấy signOut một lần
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    // Sử dụng observeQuery để theo dõi các thay đổi
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos(data.items), // Cập nhật trạng thái todos khi có sự thay đổi
    });

    // Dọn dẹp subscription khi component unmount
    return () => subscription.unsubscribe();
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      // Gọi API tạo todo mới nếu có nội dung
      client.models.Todo.create({ content });
    }
  }

  function deleteTodo(id: string) {
    // Gọi API xoá todo
    client.models.Todo.delete({ id });
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <h1>My Belu Do</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li onClick={() => deleteTodo(todo.id)} key={todo.id}>
            {todo.content}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;

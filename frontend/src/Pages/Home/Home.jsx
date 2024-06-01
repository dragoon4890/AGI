import { useState } from "react";
import NewStack from "../../assets/components/NewStack/NewStack";
import { Link } from "react-router-dom";

function Home() {
  const [stack, setStack] = useState([]);

  const addStackItem = (item) => {
    setStack((prevStack) => {
      const existingItemIndex = prevStack.findIndex((i) => i.id === item.id);
      if (existingItemIndex > -1) {
        const updatedStack = [...prevStack];
        updatedStack[existingItemIndex] = item;
        return updatedStack;
      } else {
        return [...prevStack, item];
      }
    });
  };

  return (
    <div>
      <div className="text-2xl flex flex-row justify-around items-center mt-3 w-screen border-b-2 py-3">
        <div className="flex tracking-tighter font-medium">My stacks</div>
        <div className="flex">
          <NewStack stack={stack} color="green" addStackItem={addStackItem} />
        </div>
      </div>
      <div></div>
      <div className="flex flex-col h-screen w-screen box-border pl-[30px] items-center justify-center">
        {stack.length === 0 ? (
          <div className="gap-5 bg-white h-60 w-[30rem] flex flex-col items-start justify-center rounded-2xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
            <h1 className="ml-9 text-2xl font-semibold">Create New Stack</h1>
            <p className="ml-9">Start building your generative AI apps with our</p>
            <div className="ml-9 w-36 text-sm">
              <NewStack stack={stack} addStackItem={addStackItem} color={"green"} />
            </div>
          </div>
        ) : (
          <div className="gap-5 h-[100%] mt-10 flex flex-wrap w-screen">
            {stack.map((item) => (
              <Link to={`/stack/${item.id}`} key={item.id}>
                <div className="gap-5 bg-white relative h-[168px] w-[311px] flex flex-col items-start justify-center rounded-2xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                  <h1 className="ml-9 text-xl absolute top-5 font-semibold">{item.name}</h1>
                  <p className="ml-9 absolute top-14  text-slate-700">{item.description}</p>
                  <div className="absolute right-5 bottom-6 ">
                    <NewStack stack={stack} addStackItem={addStackItem} color="green" stackId={item.id}  />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

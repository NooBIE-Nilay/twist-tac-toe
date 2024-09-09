import WordRotate from "@/components/magicui/word-rotate";

export function GameHeading() {
  return (
    <>
      <div className=" grid grid-flow-col justify-center items-center text-6xl md:text-8xl font-bold ">
        <div className="min-w-[150px] md:min-w-[240px]">
          <WordRotate
            className="  text-black dark:text-white text-end "
            words={["Tic", "Twist"]}
            duration={2000}
          />
        </div>
        <span className=" ml-6"> Tac Toe</span>
      </div>
    </>
  );
}

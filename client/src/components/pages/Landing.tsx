import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ShineBorder from "@/components/magicui/shine-border";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { GameHeading } from "@/components/GameHeading";
import { socket } from "@/socket";

export function Landing() {
  return (
    <>
      <GameHeading />
      <div className="flex justify-center  gap-12 mt-20 items-center px-10 ">
        <ShineBorder
          className=" flex  h-[350px] w-[350px] justify-center items-center  rounded-lg border bg-background md:shadow-xl"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <svg
            className=""
            fill="hsl(var(--card-foreground)) "
            opacity={0.7}
            height="250px"
            width="250px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 455.896 455.896"
          >
            <g>
              <path
                d="M432.458,330.806c8.794,0,15.926-7.132,15.926-15.926c0-8.794-7.132-15.926-15.926-15.926H331.599V155.62h100.859
		c8.794,0,15.926-7.132,15.926-15.926c0-8.794-7.132-15.926-15.926-15.926H331.599V22.909c0-8.796-7.132-15.926-15.926-15.926
		c-8.796,0-15.926,7.13-15.926,15.926v100.859H156.414V22.902c0-8.794-7.132-15.926-15.926-15.926
		c-8.796,0-15.926,7.132-15.926,15.926v100.867H23.695c-8.794,0-15.926,7.132-15.926,15.926c0,8.794,7.132,15.926,15.926,15.926
		h100.867v143.333H23.695c-8.794,0-15.926,7.132-15.926,15.926c0,8.794,7.132,15.926,15.926,15.926h100.867v100.859
		c0,8.796,7.13,15.926,15.926,15.926c8.794,0,15.926-7.13,15.926-15.926V330.806h143.333v100.867c0,8.794,7.13,15.926,15.926,15.926
		c8.794,0,15.926-7.132,15.926-15.926V330.806H432.458z M156.414,298.954V155.62h143.333v143.333H156.414z"
              />
              <path
                d="M27.652,106.497l25.235-25.241l25.235,25.241c3.11,3.11,7.184,4.666,11.26,4.666c4.075,0,8.149-1.556,11.26-4.666
		c6.222-6.213,6.222-16.299,0-22.519L75.408,58.735l25.233-25.243c6.222-6.221,6.222-16.306,0-22.519
		c-6.221-6.221-16.299-6.221-22.519,0L52.887,36.214L27.652,10.973c-6.221-6.221-16.299-6.221-22.519,0
		c-6.222,6.213-6.222,16.299,0,22.519l25.233,25.243L5.133,83.977c-6.222,6.221-6.222,16.307,0,22.519
		c3.11,3.11,7.184,4.666,11.26,4.666C20.468,111.163,24.542,109.607,27.652,106.497z"
              />
              <path
                d="M250.596,227.287l25.235-25.243c6.221-6.221,6.221-16.307,0-22.519c-6.222-6.222-16.3-6.222-22.521,0l-25.235,25.241
		l-25.235-25.241c-6.221-6.222-16.299-6.222-22.519,0c-6.221,6.213-6.221,16.299,0,22.519l25.235,25.243l-25.235,25.243
		c-6.221,6.221-6.221,16.307,0,22.519c3.11,3.11,7.186,4.666,11.26,4.666c4.075,0,8.149-1.556,11.26-4.666l25.235-25.241
		l25.235,25.241c3.11,3.11,7.186,4.666,11.26,4.666c4.076,0,8.149-1.556,11.261-4.666c6.221-6.213,6.221-16.299,0-22.519
		L250.596,227.287z"
              />
              <path
                d="M228.072,117.47c32.389,0,58.735-26.346,58.735-58.735C286.807,26.346,260.461,0,228.072,0
		c-32.389,0-58.735,26.346-58.735,58.735C169.337,91.123,195.684,117.47,228.072,117.47z M228.072,31.852
		c14.822,0,26.883,12.061,26.883,26.883c0,14.822-12.061,26.883-26.883,26.883c-14.822,0-26.883-12.061-26.883-26.883
		C201.189,43.913,213.25,31.852,228.072,31.852z"
              />
              <path
                d="M396.695,338.426c-32.389,0-58.735,26.346-58.735,58.735s26.346,58.735,58.735,58.735
		c32.388,0,58.735-26.346,58.735-58.735S429.083,338.426,396.695,338.426z M396.695,424.044c-14.822,0-26.883-12.061-26.883-26.883
		s12.061-26.883,26.883-26.883c14.822,0,26.883,12.061,26.883,26.883S411.517,424.044,396.695,424.044z"
              />
            </g>
          </svg>
        </ShineBorder>
        <div className="flex h-[400px] flex-col  justify-center items-center w-[500px] gap-6 ">
          <div className="z-10 flex items-center justify-center">
            <Link to="/create">
              <AnimatedGradientText className="text-xl">
                🎮 <hr className="mx-2 h-8 w-[1px] shrink-0 bg-gray-300" />{" "}
                <span
                  className={cn(
                    `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent text-xl`
                  )}
                >
                  Create Game
                </span>
                <ChevronRight className="ml-1 size-6 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedGradientText>
            </Link>
          </div>
          <div className="z-10 flex  items-center justify-center">
            <Link to="/join">
              <AnimatedGradientText className="text-xl">
                🤝🏻 <hr className="mx-2 h-8 w-[1px] shrink-0 bg-gray-300" />{" "}
                <span
                  className={cn(
                    `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent text-xl`
                  )}
                >
                  Join Game
                </span>
                <ChevronRight className="ml-1 size-6 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedGradientText>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

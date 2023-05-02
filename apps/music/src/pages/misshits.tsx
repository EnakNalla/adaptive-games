import dynamic from "next/dynamic";

export default dynamic(() => import("~/components/Misshits"), {ssr: false});

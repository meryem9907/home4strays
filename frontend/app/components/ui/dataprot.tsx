import { Link } from "@/i18n/routing";


export default function Dataprot (){
	return( 
	<div className="bg-primary/30 shadow-sm h-4 flex justify-center items-center gap-2">
		<Link href="/imprint" className="text-xs link link-primary font-medium overflow-block">
		Imprint
		</Link>
		<p >-</p>
		
		<Link href="/datapolice" className="text-xs link link-primary font-medium ">
		Data privacy policy
		</Link> 
	</div>
	)
}

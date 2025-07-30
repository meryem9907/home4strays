import Image from "next/image";

interface CardProps {
  title: string;
  image_url: string;
}

export default function Card({
  title,
  image_url
}: CardProps) {

  return (
    <div className="card bg-accent text-accent-content shadow-sm rounded-2xl
                transform transition-transform duration-100 ease-out
                hover:scale-105 hover:shadow-md
                h-50 w-60 md:w-50 mx-auto">
      <figure className="h-40 bg-white">
        <Image
          src={ image_url }
          height={ 200 }
          width={ 200 }
          alt={ title } 
        />
      </figure>
      <div className="card-body flex items-center justify-center py-4">
          <h2 className="card-title text-xl"> { title } </h2>  
      </div>
    </div>
  )   
}

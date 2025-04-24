import HTMLFlipBook from "react-pageflip";
import parse from "html-react-parser";

const BookPreview = ({ pages }: { pages: string[] }) => {
  return (
    // @ts-ignore
    <HTMLFlipBook className="flip-book" width={300} height={500}>
      {pages.map((page) => (
        <div className="page text-white">{parse(page)}</div>
      ))}
    </HTMLFlipBook>
  );
};

export default BookPreview;

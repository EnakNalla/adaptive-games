import {type Video} from "@ag/db";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import Image from "next/image";
import {useRouter} from "next/router";
import {useCallback, useRef} from "react";
import {ListGroup, Spinner} from "react-bootstrap";
import {api} from "~/utils/api";
import {useAppStore} from "~/utils/useAppStore";
import styles from "./results.module.css";

const Results = ({sidebar}: {sidebar?: boolean}) => {
  const router = useRouter();
  const [listRef] = useAutoAnimate<HTMLDivElement>();
  const [videos, pageToken, q] = useAppStore(s => [s.videos, s.pageToken, s.q]);
  const {mutateAsync: search, isLoading} = api.yt.search.useMutation({
    onSuccess: data => {
      useAppStore.setState({
        pageToken,
        videos: [...videos, ...data.videos].filter(
          (video, index, self) => self.findIndex(v => v.id === video.id) === index
        )
      });
    }
  });

  const observerRef = useRef<IntersectionObserver>();
  const lastVideoRef = useCallback((node: HTMLAnchorElement | null) => {
    if (isLoading || !node) return;
    if (observerRef.current) observerRef.current.disconnect();
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    observerRef.current = new IntersectionObserver(async entries => {
      if (entries[0]?.isIntersecting && !isLoading && pageToken) {
        await search({q, pageToken});
      }
    });
    observerRef.current.observe(node);
  }, []);

  const handleClick = (video: Video) => {
    useAppStore.setState({video, playlistId: null});
    void router.push(`/video/${video.id}`);
  };

  return (
    <div>
      <ListGroup ref={listRef}>
        {videos.map((video, index) => {
          const thumb = sidebar ? video.thumbnails.default.url : video.thumbnails.medium.url;
          const size = sidebar ? {width: 120, height: 90} : {width: 320, height: 180};

          return (
            <ListGroup.Item
              action
              key={video.id}
              ref={videos.length === index + 1 ? lastVideoRef : undefined}
              onClick={() => handleClick(video)}
              role="link"
              className={styles.item}
            >
              <Image src={thumb} {...size} alt={video.title} />

              <div>
                <p
                  className={`${styles.title ?? ""} ${sidebar ? "fs-6" : ""}`}
                  dangerouslySetInnerHTML={{__html: video.title}}
                />
                {!sidebar && <p className={styles.description}>{video.description}</p>}
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      {isLoading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {!isLoading && !pageToken && <p className="h2 text-center">No more videos</p>}
    </div>
  );
};

export default Results;

import styles from "./About.module.css";
import { brickWall } from "../assets";

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.title}>Brick by Brick</h1>
      <img
        src={brickWall}
        alt="A photo of a brick wall"
        className={styles.image}
      />
      <p className={styles.quote}>
        "The first and greatest victory is to conquer yourself; to be conquered
        by yourself is of all things most shameful and vile." - Plato
      </p>
      <div className="content">
        <p>
          For most of my life I've been going along with the flow. Like many of
          my peers, I conformed to my expectations and never aimed to be
          something better than I already was. This led to a boring yet safe
          life. It's not bad per se, but it just isn't for me. So one day I
          decided to change.
        </p>
        <p>
          It's quite funny because it all started while I was doomscrolling
          online. When I was younger, I was really addicted to the internet,
          sometimes reaching over 12 hours per day. Whenever I had free time
          away from the daily chores of life, I opted for the internet. It isn't
          a stretch to say that it was the highlight of my life when I was
          young, leading to the path I've chose for myself today. I never really
          fit in at school, so for a long time YouTube and Roblox were my only
          sources of social connection.
        </p>
        <p>
          Fortunately the present times have been good to me, and I was able to
          do well academically and socially. Without them, I probably wouldn't
          have adjusted as well as I did today, but I digress. During one of my
          daily internet sessions while I was in high school, I stumbled upon a
          post on Reddit about a single piece of advice that would change my
          life. Again, during that time I didn't really know who or what I
          wanted to be, nor even what I should start doing to improve my life.
          That post subsequently changed it all for me, and it was simply about
          "non-zero days", every single day.
        </p>
        <p>
          It was quite a long post but it boiled down to one simple truth:
          improve at one thing. Do it every single day. That's all. Whether it's
          exercising, eating healthy, or programming, all you have to do is do
          one small thing that improved yourself. For example with exercising,
          you don't just start with a full on routine at the beginning. Instead,
          you just do one small thing a day so you can say that you improved
          yourself. Before implementing this, I had constantly failed at losing
          weight and keeping a good exercise routine. After doing non-zero days
          for a couple of months, it naturally built itself up for me.
        </p>
        <p>
          That was the beginning of my self improvement journey, and I'm proud
          to say that I'm still improving after all these years. What really
          changed was that I made it easy enough to do, yet not hard enough to
          justify quitting. Time will compound the results for me, so all I have
          to worry about is doing what I can every single day. Life is still
          hard, but it's manageable now compared to the overwhelming things
          everyone had to confront as they live and grow. With this blog it will
          be another small brick, and I hope that time will also compound my
          programming skills until this looks like child's play in the future.
        </p>
        <p>
          I hope I didn't overwhelm you with this short article, but my point is
          that this blog is another small step in my growth as a human being.
          This blog is another stepping stone in my programming journey, and I
          don't plan on quitting until the day I die, and even then I might
          still keep going on. I thank you for reading this about me section,
          and I hope to impress you (and myself) in the future with what I have
          in store. With that in mind, I end this blog post and hope you have a
          great day.
        </p>
      </div>
    </div>
  );
};

export { About };

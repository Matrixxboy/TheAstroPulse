import React, { useEffect } from 'react';
import './palmistry.css';

const Palmistry = () => {
  useEffect(() => {
    const treeItems = document.querySelectorAll("#tree li");
    const toggleItem = (e) => {
      e.stopPropagation();
      e.currentTarget.classList.toggle("open");
    };

    treeItems.forEach((li) => {
      li.addEventListener("click", toggleItem);
    });

    return () => {
      treeItems.forEach((li) => {
        li.removeEventListener("click", toggleItem);
      });
    };
  }, []);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-left max-w-4xl w-full">
        <h1 className="text-center text-3xl font-bold text-yellow-400 mb-6">Palmistry Tree Diagram</h1>
        <ul id="tree">
          {/* Tree content unchanged */}
          <li>Life Line
            <ul className="nested">
              <li>Shape
                <ul className="nested">
                  <li>Long & Deep → Strong vitality</li>
                  <li>Short → Efficient energy</li>
                  <li>Faint → Weak health</li>
                </ul>
              </li>
              <li>Curve
                <ul className="nested">
                  <li>Wide → Adventurous</li>
                  <li>Close to Thumb → Cautious</li>
                </ul>
              </li>
              <li>Color
                <ul className="nested">
                  <li>Red → Disease resistance</li>
                  <li>White → Low immunity</li>
                </ul>
              </li>
              <li>Breaks
                <ul className="nested">
                  <li>One → Health change</li>
                  <li>Multiple → Instability</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>Head Line
            <ul className="nested">
              <li>Length
                <ul className="nested">
                  <li>Long → Determination</li>
                  <li>Short → Common sense</li>
                </ul>
              </li>
              <li>Shape
                <ul className="nested">
                  <li>Straight → Logical</li>
                  <li>Curved → Creative</li>
                </ul>
              </li>
              <li>Clarity
                <ul className="nested">
                  <li>Clear → Focused</li>
                  <li>Faint → Fatigue</li>
                </ul>
              </li>
              <li>Breaks
                <ul className="nested">
                  <li>Break → Trauma</li>
                  <li>Chain → Stress</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>Heart Line
            <ul className="nested">
              <li>Shape
                <ul className="nested">
                  <li>Straight → Polite</li>
                  <li>Curved → Passionate</li>
                </ul>
              </li>
              <li>Length
                <ul className="nested">
                  <li>Long → Deep love</li>
                  <li>Short → Self-focused</li>
                </ul>
              </li>
              <li>Branches
                <ul className="nested">
                  <li>Up → Happy love</li>
                  <li>Down → Heartbreak</li>
                </ul>
              </li>
              <li>Breaks
                <ul className="nested">
                  <li>Break → Emotional loss</li>
                  <li>Chain → Mood swings</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>Fate Line
            <ul className="nested">
              <li>Start Point
                <ul className="nested">
                  <li>From Life Line → Self-made</li>
                  <li>From Moon → Support-based</li>
                  <li>From Wrist → Early success</li>
                </ul>
              </li>
              <li>End Point
                <ul className="nested">
                  <li>Saturn → Public image</li>
                  <li>Short → Career change</li>
                </ul>
              </li>
              <li>Clarity
                <ul className="nested">
                  <li>Clear → Focused career</li>
                  <li>Faint → Career confusion</li>
                </ul>
              </li>
              <li>Breaks
                <ul className="nested">
                  <li>Break → Career breaks</li>
                  <li>Multiple → Multi-career</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>Sun Line
            <ul className="nested">
              <li>Meaning → Fame, Art, Recognition</li>
              <li>Starts at Wrist → Early talent</li>
              <li>Deep → Creativity</li>
              <li>Absent → Private life</li>
            </ul>
          </li>
          <li>Mercury Line
            <ul className="nested">
              <li>Meaning → Health & Communication</li>
              <li>Deep → Business mind</li>
              <li>Wavy → Health issues</li>
              <li>Absent → Good health</li>
            </ul>
          </li>
          <li>Marriage Lines
            <ul className="nested">
              <li>Number → Love relationships</li>
              <li>Long → Strong bond</li>
              <li>Forked → Separation</li>
              <li>Short → Flings</li>
            </ul>
          </li>
          <li>Girdle of Venus
            <ul className="nested">
              <li>Present → Sensitivity</li>
              <li>Broken → Mood issues</li>
              <li>Absent → Stable mind</li>
            </ul>
          </li>
          <li>Travel Lines
            <ul className="nested">
              <li>Horizontal → Journeys</li>
              <li>Deep → Success in travels</li>
            </ul>
          </li>
          <li>Children Lines
            <ul className="nested">
              <li>Thin → Girl child</li>
              <li>Thick → Boy child</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Palmistry;
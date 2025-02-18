import React from "react";

function Footer() {
  return (
    <footer class="footer">
      <div class="footer-content">
        <p>
          &copy; {new Date().getFullYear()} |{" "}
          <a href="mailto:rajlic.david@gmail.com" target="_blank">
            <b> David Rajlič</b>
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;

"use client";
import { Container } from "@mantine/core";
import classes from "./Footer.module.css";
import Image from "next/image";
import { Typography } from "@mui/material";
import Link from "next/link";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link href={"#"} style={{ textDecoration: 'none', color: 'gray' }}>
        Direct Transport Solutions
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Footer() {
  // const items = links.map((link) => (
  //   <Anchor<"a">
  //     c="dimmed"
  //     key={link.label}
  //     href={link.link}
  //     onClick={(event) => event.preventDefault()}
  //     size="sm"
  //   >
  //     {link.label}
  //   </Anchor>
  // ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Image src={"/logo.png"} alt="logo" width={100} height={100} />
        {/* <Group className={classes.links}>{items}</Group> */}
        <Copyright sx={{ mt: 8, mb: 4 }} />

      </Container>
    </div>
  );
}

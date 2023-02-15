import {Container, Nav, Navbar, Offcanvas, NavDropdown, Button} from "react-bootstrap";
import {useRouter} from "next/router";
import {api} from "../../utils/api";
import {useAppStore} from "../../utils/useAppStore";
import {InlineForm} from "@ag/ui";
import {Search} from "react-bootstrap-icons";
import {useConfig} from "../../utils/hooks";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {signOut} from "next-auth/react";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), {ssr: false});

const navLinks: {href: string; label: string}[] = [
  {label: "Manage configs", href: "/config/manage"},
  {label: "Manage global playlists", href: "/config/playlist/global"}
];

const NavBar = () => {
  const router = useRouter();
  const configId = useAppStore(s => s.configId);
  const {data: config} = useConfig(configId);
  const {data: globalPlaylists} = api.yt.getGlobalPlaylists.useQuery();
  const {mutateAsync} = api.yt.search.useMutation();

  const handleSearch = async (term: string) => {
    const data = await mutateAsync({q: term});
    useAppStore.setState({videos: data.videos, pageToken: data.pageToken, q: term});

    await router.push("/results");
  };

  return (
    <Navbar expand="false" className="bg-body-tertiary" collapseOnSelect>
      <Container fluid>
        <Navbar.Brand as={Link} href="/" className="ms-3">
          <Image src="/logo.svg" alt="Adaptive Games Logo" width={42} height={42} />
        </Navbar.Brand>

        <InlineForm
          btnProps={{children: <Search />}}
          id="search"
          label="Search"
          onSubmit={handleSearch}
          className="d-none d-sm-block"
          initialValue=""
          placeholder="Search for videos"
        />

        <Navbar.Toggle />

        <Navbar.Offcanvas placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <Nav.Link as={Link} href="/" className="">
                <Image src="/logo.svg" alt="Adaptive Games Logo" width={42} height={42} />
              </Nav.Link>
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <InlineForm
              className="d-block d-sm-none"
              btnProps={{children: <Search />}}
              id="search"
              label="Search"
              onSubmit={handleSearch}
              initialValue=""
              placeholder="Search for videos"
            />
            <Nav className="justify-content-end flex-grow-1 pe-3" activeKey={router.pathname}>
              {navLinks.map(({href, label}) => (
                <Nav.Link as={Link} href={href} key={label} className="mt-3">
                  {label}
                </Nav.Link>
              ))}

              <NavDropdown title="Playlists" className="my-3">
                {config?.playlists.map(playlist => (
                  <NavDropdown.Item as={Link} href={`/playlist/${playlist.id}`} key={playlist.id}>
                    {playlist.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <NavDropdown title="Global playlists">
                {globalPlaylists?.map(playlist => (
                  <NavDropdown.Item
                    as={Link}
                    href={`/playlist/${playlist.id}?isGlobal=${playlist.isGlobal ? "y" : "n"}`}
                    key={playlist.id}
                  >
                    {playlist.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <Nav.Item className="my-3 justify-content-center d-flex">
                <ThemeToggle />
              </Nav.Item>

              <Button role="link" onClick={() => void signOut()}>
                Logout
              </Button>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default NavBar;

import type { GetStaticProps, NextPage } from 'next';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import ProjectList from '../components/ProjectList';
import { Workspace, workspace } from '../workspace';

interface Props {
  workspace: Workspace;
}

export const getStaticProps: GetStaticProps<Props> = async _ctx => {
  return {
    props: {
      workspace: await workspace(),
    },
  };
};

const IndexPage: NextPage<Props> = ({ workspace }) => {
  return (
    <>
      <Logo className="my-6" />
      <ProjectList projects={workspace.projects} />
      <Footer className="mt-12 mb-4" />
    </>
  );
};

export default IndexPage;

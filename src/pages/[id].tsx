import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Workspace, workspace } from '../workspace';
import ProjectDetail from '../components/ProjectDetail';

interface Props {
  workspace: Workspace;
  id: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const w = await workspace();
  return {
    paths: w.projects.map(({ id }) => ({ params: { id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ctx => {
  return {
    props: {
      workspace: await workspace(),
      id: ctx.params!.id as string,
    },
  };
};

const ProjectPage: NextPage<Props> = ({ workspace, id }) => {
  const { source, data } = workspace.projects.find(p => p.id == id)!;
  return (
    <>
      <Header workspace={workspace} currentProject={id} />
      <ProjectDetail className="my-12" source={source} data={data} />
      <Footer className="mt-12 mb-4" />
    </>
  );
};

export default ProjectPage;

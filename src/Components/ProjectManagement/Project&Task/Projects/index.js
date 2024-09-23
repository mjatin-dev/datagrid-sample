import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DeactivateAndDeleteModal from "../../components/Modals/DeactivateAndDeleteModal";
import Project from "../../ProjectDesktop";
import BackDrop from "../../../../CommonModules/sharedComponents/Loader/BackDrop";
const Projects = ({ searchQuery }) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const projectsData = useSelector(
    (state) => state?.ProjectManagementReducer?.projectManagementData?.projects
  );
  const isLoading = useSelector(
    (state) => state?.ProjectManagementReducer?.projectManagementData?.isLoading
  );
  const isError = useSelector(
    (state) => state?.ProjectManagementReducer?.projectManagementData?.isError
  );

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData, isLoading, isError]);
  return (
    <>
      <BackDrop isLoading={isLoading} />
      <DeactivateAndDeleteModal
        visible={isShowModal}
        onClose={() => setIsShowModal(false)}
      />
      {!isLoading &&
        !isError &&
        projects &&
        projects.length > 0 &&
        [
          ...(searchQuery
            ? [...projects].filter((item) =>
                item?.project_name
                  ?.toLowerCase()
                  ?.includes(searchQuery?.toLowerCase())
              )
            : projects),
        ].map((project) => {
          return <Project data={project} />;
        })}
      {!isLoading && projects?.length === 0 && (
        <p className="project-trash__not-found">No projects found</p>
      )}
    </>
  );
};

export default Projects;

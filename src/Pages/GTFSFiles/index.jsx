import Header from "../../Components/Header";
import FaqBanner from "../../Components/FaqBanner";
import { Table } from "react-bootstrap";
import "./gtfsfilestables.css"
import Subscribe from "../../Components/Subscribe";
import Footer from "../../Components/Footer";
export const GTFSFiles = () => {
  return (
    <>
      <Header />
      <FaqBanner
        title="Manage Your GTFS Files Here"
        description="Add, Delete, & Edit your GTFS Files"
      />
      <div className="container">
      <div className="row mb-5 justify-content-center">
            <div className="col-lg-6 text-center">
              <h2 className="section-title text-center mb-3">Your Files</h2>
            </div>
          </div>
        <div className="row justify-content-center mb-5">
          <div className="col-md-8">
            <Table striped bordered responsive hover className="gtfs_files_tables">
              <thead>
                <tr className="text-center">
                  <th>GTFS Files</th>
                  <th>File Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Stops</td>
                  <td>Stops_1</td>
                  <td className="d-flex gap-4 ">
                    <button className="btn btn-primary py-2 px-3">
                      Add Files
                    </button>
                    <button className="btn btn-secondary  py-2 px-3">
                      Edit Files
                    </button>
                    <button className="btn btn-danger  py-2 px-3">
                      Delete Files
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Routes</td>
                  <td>Routes_1</td>
                  <td className="d-flex gap-4 ">
                    <button className="btn btn-primary py-2 px-3">
                      Add Files
                    </button>
                    <button className="btn btn-secondary  py-2 px-3">
                      Edit Files
                    </button>
                    <button className="btn btn-danger  py-2 px-3">
                      Delete Files
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Routes</td>
                  <td>Routes_2</td>
                  <td className="d-flex gap-4 ">
                    <button className="btn btn-primary py-2 px-3">
                      Add Files
                    </button>
                    <button className="btn btn-secondary  py-2 px-3">
                      Edit Files
                    </button>
                    <button className="btn btn-danger  py-2 px-3">
                      Delete Files
                    </button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <Subscribe />
      <Footer />
    </>
  );
};

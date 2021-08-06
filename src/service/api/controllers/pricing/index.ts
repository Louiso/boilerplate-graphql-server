interface GetCodesArgs {
  tasks: {
    taskId: string;
    contentTask: {
      content: {
        laborReference: boolean;
        securityReference: boolean;
      };
    };
  }[];
}

interface GetCodesResponse {
  taskId: string;
  codes: string[];
}

const getCodes = async ({ tasks }: GetCodesArgs
): Promise<GetCodesResponse[]> => {
  try {
    return tasks.map((task) => {
      const codes: string[] = []

      if(task.contentTask.content.laborReference) codes.push('RVW-CNDDT-BKGC')
      if(task.contentTask.content.securityReference) codes.push('CNDDT-BKGC')

      return ({
        taskId: task.taskId,
        codes
      })
    })
  } catch (error) {
    throw error
  }
}

export default {
  getCodes
}
